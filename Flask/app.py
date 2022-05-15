from functools import wraps
import io
from datetime import timedelta
from firebase_admin import auth, exceptions
from flask import Flask, send_from_directory, request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin

from models import *
from sample_data import *


load_dotenv()

TOKEN_TTL_IN_DAYS = 5

# Wrapper that validates that the given user_id matches the user_id on the claims
def validate_user(func):
    @wraps(func)
    def wrapper(user_id, *args, **kwargs):
        # ensure that the user has a session cookie
        session_cookie = request.cookies.get('session')
        if not session_cookie:
            return {'message': 'No session cookie provided.'}, 400
        try:
            # verify the session cookie is valid
            decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
            # verify user if provided
            if user_id != decoded_claims.get("uid"):
                return {'message': 'Unauthorized.'}, 401
            return func(user_id, *args, **kwargs)
        # bug workaround for session cookies used too early
        except auth.InvalidSessionCookieError as e:
            print(e)
            if str(e).startswith("Token used too early"):
                if user_id != decoded_claims.get("uid"):
                    return {'message': 'Unauthorized.'}, 401
                return func(user_id, *args, **kwargs)
            return {'message': 'Invalid session cookie.'}, 400
        except Exception as e:
            print(e)
            return {'message': 'Error validating session cookie.'}, 400
    return wrapper

# Wrapper that validates that the given project_id belongs to the user_id on the claims
def validate_project(func):
    @wraps(func)
    def wrapper(project_id, *args, **kwargs):
        # ensure that the user has a session cookie
        session_cookie = request.cookies.get('session')
        if not session_cookie:
            return {'message': 'No session cookie provided.'}, 400
        try:
            # verify the session cookie is valid
            decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
            user_id = decoded_claims.get("uid")
            # ensure the user has access to the project_id
            user_dict = get_user(user_id)
            owned_projects = user_dict.get("owned_projects")
            if owned_projects:
                for project in owned_projects:
                    if project.get("project_id") == project_id:
                        return func(project_id, *args, **kwargs)
                return {'message': 'Unauthorized.'}, 401
        # bug workaround for session cookies used too early     
        except auth.InvalidSessionCookieError as e:
            print(e)
            if str(e).startswith("Token used too early"):
                user_id = decoded_claims.get("uid")
                # ensure the user has access to the project_id
                user_dict = get_user(user_id)
                owned_projects = user_dict.get("owned_projects")
                if owned_projects:
                    for project in owned_projects:
                        if project.get("project_id") == project_id:
                            return func(project_id, *args, **kwargs)
                    return {'message': 'Unauthorized.'}, 401
            return {'message': 'Invalid session cookie.'}, 400
        except Exception as e:
            print(e)
            return {'message': 'Error validating session cookie.'}, 400
    return wrapper


app = Flask(
    __name__,
    static_folder='react-sleuths/build', 
    static_url_path=''
)
CORS(app)


# route to exchange JWT for session cookie
@app.route('/sessionLogin', methods=['POST'])
def session_login():
    if not request.headers.get('authorization'):
        return {'message': 'No token provided'}, 400
    try:
        # get the token from request header
        str_token = request.headers['authorization']
        token_list = str_token.split()
        # token_list[0] = 'Bearer', token_list[1] = JWT
        id_token = token_list[1]
        # Set session expiration to TOKEN_TTL_IN_DAYS days.
        expires_in = timedelta(days=TOKEN_TTL_IN_DAYS)
        # Create the session cookie. This will also verify the ID token
        # in the process. The session cookie will have the same claims as
        # the ID token.
        session_cookie = auth.create_session_cookie(id_token,
                                                    expires_in=expires_in)
        response = jsonify({'status': 'success'})
        # Set cookie policy for session cookie.
        expires = datetime.now() + expires_in
        response.set_cookie(
            'session', session_cookie, expires=expires, httponly=True, secure=True)
        return response
    except exceptions.FirebaseError as e:
        print(e)
        return abort(401, 'Failed to create a session cookie')


# route to end session and logout
@app.route('/sessionLogout', methods=['POST'])
def session_logout():
    response = jsonify({'status': 'success'})
    response.set_cookie('session', expires=0)
    return response


# route to create a user
@app.route('/createUser', methods=['POST'])
def create_user():
    data = request.json
    # validate required request params were sent
    missing_params = []
    if data.get('first_name') is None or not data['first_name']:
        missing_params.append('first_name')
    if data.get('last_name') is None or not data['last_name']:
        missing_params.append('last_name')
    if data.get('email') is None or not data['email']:
        missing_params.append('email')
    if data.get('user_id') is None or not data['user_id']:
        missing_params.append('user_id')
    if len(missing_params) > 0:
        message = ', '.join(missing_params) + " required."
        return {'message': message}, 400
    res = create_teacher(Teacher(data['first_name'], data['last_name'], data['email']), data['user_id'])
    if res == 0:
        return {'message': 'Success!'}, 200
    else:
        return {'message': "Error creating user."}, 400


@app.route('/users/<string:user_id>/projects', methods=['GET', 'POST'])
@validate_user
def get_projects(user_id):
    """
    Returns list of projects owned by the user
    :param user_id: ID of user
    """
    owned_projects = get_all_project_details(user_id)
    if owned_projects:
        return json.dumps(owned_projects, default=vars)
    return json.dumps([])


@app.route('/projects/<string:project_id>', methods=['GET', 'POST'])
@validate_project
def get_single_project(project_id):
    """
    Returns single project base info including
    - owner_id, description, questions, question info
    :param project_id: ID of project
    """
    single_project = get_project(project_id)
    if single_project:
        return json.dumps(single_project, default=vars)
    return json.dumps([])


@app.route('/projects/<string:project_id>/observations', methods=['GET', 'POST'])
@validate_project
def get_project_observations(project_id):
    """
    Returns observations list of a single project
    :param project_id: ID of project
    """
    observations = get_all_project_observations(project_id)
    return json.dumps(observations)

  
@app.route('/projects/<string:project_id>/download', methods=['GET', 'POST'])
@validate_project
def download_csv_file(project_id):
    '''
    Returns .csv file of a single project
    param project_id: ID of project
    Credits to vectorfrog @ https://stackoverflow.com/questions/26997679/
    '''
    try:
        file_content = io.StringIO()
        file_content = write_project_to_file(project_id)
        csv_response = make_response(file_content.getvalue())
        csv_response.headers["Content-Disposition"] = "attachment; filename=export.csv"
        csv_response.headers["Content-type"] = "text/csv"
        return csv_response
    except Exception as e:
        print(e)
        return {'message': 'Error creating CSV file.'}, 400


@app.route('/users/<string:user_id>/projects/create', methods=['GET', 'POST'])
@validate_user
def create_new_project(user_id):
    """
    Adds a new project to the firestore database
    :return: the project ID
    """
    try:
        content = request.json

        new_project = Project(
            user_id,
            content['title'],
            content['description'],
        )

        for question in content['questions']:
            new_question = Question(
                question['question_num'],
                question['prompt'],
                question['type'],
                question['choices'],
                question['range_min'],
                question['range_max']
            )
            new_project.add_question(new_question)

        new_project_id = create_project(new_project)
        return {"project_id" : new_project_id}
    except Exception as e:
        print(e)
        return {'message': 'Error creating new project.'}, 400


@app.route('/projects/<string:project_id>/delete', methods=['GET', 'DELETE'])
@validate_project
def delete_existing_project(project_id):
    if delete_project(project_id) == 0:
        return {'message': 'Success!'}, 200
    return {'message': 'Error deleting project.'}, 400


@app.route('/projects/<string:project_id>/update', methods=['GET', 'PUT'])
@validate_project
def update_project(project_id):
    pass

@app.route('/users/<string:user_id>/create-sample-project', methods=['GET','POST'])
@validate_user
def create_sample_project(user_id):
    '''
    Adds a sample project to the firestore database
    Returns the project id
    '''
    try:
        new_project_id = generate_random_project(user_id)
        return {"project_id" : new_project_id}
    except Exception as e:
        print(e)
        return {'message': 'Error generating sample project.'}, 400



@app.route('/')
@app.route('/dash')
@app.route('/dash/projects')
@cross_origin()
def serve():
    """
    Serves the React frontend.
    """
    return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(404)
def not_found(e):
    """
    Force use of react-router for routing frontend pages
    Credits to Joao Ramiro @ https://stackoverflow.com/questions/30620276/
    :param e: error
    """
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
