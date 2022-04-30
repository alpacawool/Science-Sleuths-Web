import json
from functools import wraps

from firebase_admin import auth, exceptions
from dotenv import load_dotenv
from flask import Flask, send_from_directory, request, jsonify, abort, redirect, make_response
from flask_cors import CORS, cross_origin

from models import *


load_dotenv()

TOKEN_TTL_IN_DAYS = 5


app = Flask(
    __name__,
    static_folder='react-sleuths/build', 
    static_url_path=''
)
#CORS(app)

# route to exchange JWT for session cookie
@app.route('/sessionLogin', methods=['POST'])
def session_login():
    # Get the ID token sent by the client
    if not request.headers.get('authorization'):
        return {'message': 'No token provided'}, 400
    try:
        # token must be attached as authorization header in the form 'Bearer JWT' so split on space
        str_token = request.headers['authorization']
        token_list = str_token.split()
        # token_list[0] = 'Bearer', token_list[1] = JWT
        id_token = token_list[1]
        # Set session expiration to TOKEN_TTL_IN_DAYS days.
        expires_in = datetime.timedelta(days=TOKEN_TTL_IN_DAYS)
        # Create the session cookie. This will also verify the ID token in the process.
        # The session cookie will have the same claims as the ID token.
        session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
        response = jsonify({'status': 'success'})
        # Set cookie policy for session cookie.
        expires = datetime.datetime.now() + expires_in
        response.set_cookie(
            'session', session_cookie, expires=expires, httponly=True, secure=True)
        return response
    except exceptions.FirebaseError as e:
        print(e)
        return abort(401, 'Failed to create a session cookie')

# route to end session and logout
@app.route('/sessionLogout', methods=['POST'])
def session_logout():
    response = response = jsonify({'status': 'success'})
    response.set_cookie('session', expires=0)
    return response

@app.route('/users/<string:user_id>/projects', methods=['GET', 'POST'])
def get_projects(user_id):
    '''
    Returns list of projects owned by the user
    param user_id: ID of user
    '''
    # ensure that the user is allowed
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        # Session cookie is unavailable. Force user to login.
        print("No session cookie available!")
        return redirect('/login')
    # Verify the session cookie. In this case an additional check is added to detect
    # if the user's Firebase session was revoked, user deleted/disabled, etc.
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        # check that the user_id matches the claims uid
        if decoded_claims.get("user_id") != user_id:
            print("User id doesn't match session cookie!")
            return redirect('/login')
        owned_projects = get_all_project_details(user_id)
        if owned_projects:
            return(json.dumps(owned_projects, default=vars))
        return {}
    except auth.InvalidSessionCookieError:
        # Session cookie is invalid, expired or revoked. Force user to login.
        print("Invalid (expired) session cookie!")
        return redirect('/login')

@app.route('/projects/<string:project_id>', methods=['GET', 'POST'])
def get_single_project(project_id):
    '''
    Returns single project base info including
    - owner_id, description, questions, question info
    param project_id: ID of project
    '''
    # ensure that the user is allowed
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        # Session cookie is unavailable. Force user to login.
        return redirect('/login')
    # Verify the session cookie. In this case an additional check is added to detect
    # if the user's Firebase session was revoked, user deleted/disabled, etc.
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        print(decoded_claims)
        # check that the project_id is owned by user
        user_id = decoded_claims.get("uid")
        if user_id:
            user_dict = get_user(user_id)
            owned_projects = user_dict.get("owned_projects")
            if owned_projects:
                # project is owned by user
                for project in owned_projects:
                    if project.get("project_id") == project_id:
                        single_project = get_project(project_id)
                        if single_project:
                            return(json.dumps(single_project, default=vars))
                        return {}
                return {'message': 'Unauthorized.'}, 401      
    except auth.InvalidSessionCookieError:
        # Session cookie is invalid, expired or revoked. Force user to login.
        return redirect('/login')


@app.route('/projects/<string:project_id>/observations', methods=['GET', 'POST'])
def get_project_observations(project_id):
    '''
    Returns observations list of a single project
    param project_id: ID of project
    '''
     # ensure that the user is allowed
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        # Session cookie is unavailable. Force user to login.
        return redirect('/')
    # Verify the session cookie. In this case an additional check is added to detect
    # if the user's Firebase session was revoked, user deleted/disabled, etc.
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        print(decoded_claims)
        # check that the project_id is owned by user
        user_id = decoded_claims.get("uid")
        if user_id:
            user_dict = get_user(user_id)
            owned_projects = user_dict.get("owned_projects")
            if owned_projects:
                # project is owned by user
                for project in owned_projects:
                    if project.get("project_id") == project_id:
                        db = firestore.client()
                        obs_stream = db.collection(u'Projects').document(project_id)\
                            .collection(u'Observations').stream()
                        observations_list = []
                        for obs in obs_stream:
                            obs_data = obs.to_dict()
                            # sad we have to convert to str because DatetimeWithNanoseconds
                            obs_data['datetime']  = str(obs_data['datetime'])
                            for response in obs_data['responses']:
                                # also converting to str because DatetimeWithNanoseconds
                                response['response'] = str(response['response'])
                            observations_list.append(obs_data)
                        return(json.dumps(observations_list))
                return {'message': 'Unauthorized.'}, 401      
    except auth.InvalidSessionCookieError:
        # Session cookie is invalid, expired or revoked. Force user to login.
        return redirect('/login')


@app.route('/create-new-project', methods=['GET','POST'])
def create_new_project():
    '''
    Adds a new project to the firestore database
    Returns the project id
    '''
    content = request.json

    new_project = Project(
        content['owner_id'],
        content['title'],
        content['description'],
        []
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

    return {
        "project_id" : new_project_id
    }

@app.route('/')
@app.route('/dash')
@app.route('/dash/projects')
@cross_origin()
def serve():
    '''
    # Serve React Frontend
    '''
    return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(404)
def not_found(e):
    '''
    Force use of react-router for routing frontend pages
    Credits to Joao Ramiro @ https://stackoverflow.com/questions/30620276/
    '''
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run()
