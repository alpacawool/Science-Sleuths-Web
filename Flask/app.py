import json
from functools import wraps

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials
from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin

from models import *

load_dotenv()



app = Flask(
    __name__,
    static_folder='react-sleuths/build', 
    static_url_path=''
)
CORS(app)

@app.route('/hello', methods=['GET'])
@cross_origin()
def index():
    return {
        "hello" : "Science Sleuths : Citizen Science App for Kids"
    }


@app.route('/users/<string:user_id>/projects', methods=['GET'])
def get_projects(user_id):
    '''
    Returns list of projects owned by the user
    param user_id: ID of user
    '''
    owned_projects = get_all_project_details(user_id)
    if (owned_projects != None):
        return(json.dumps(owned_projects, default=vars))
    return {}

@app.route('/projects/<string:project_id>', methods=['GET'])
def get_single_project(project_id):
    '''
    Returns single project base info including
    - owner_id, description, questions, question info
    param project_id: ID of project
    '''
    single_project = get_project(project_id)
    if (single_project != None):
        return(json.dumps(single_project, default=vars))
    return {}

@app.route('/projects/<string:project_id>/observations', methods=['GET'])
def get_project_observations(project_id):
    '''
    Returns observations list of a single project
    param project_id: ID of project
    '''
    observation_list = get_all_project_observations(project_id)

    if (observation_list != None):
        observation_responses = []
        for i in range(0, len(observation_list)):
            observation = {
                'author_id' : observation_list[i].author_id,
                # Datetime has an issue being serialized, converting to string
                'datetime' : str(observation_list[i].datetime),
                'first_name' : observation_list[i].first_name,
                'last_name': observation_list[i].last_name,
                'project_id': observation_list[i].project_id,
                'responses' : [],
                'title': observation_list[i].title
            }

            for j in range(0, len(observation_list[i].responses)):
                print(observation_list[i].responses[j].response)
                response = {
                    'question_num' : observation_list[i].responses[j].question_num,
                    'response' : str(observation_list[i].responses[j].response),
                    'type' :  observation_list[i].responses[j].type
                }
                observation['responses'].append(response)

            observation_responses.append(observation)
        return(json.dumps(observation_responses))
    return {}

# Serve React Frontend
@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Force use of react-router for routing frontend pages
# https://stackoverflow.com/questions/30620276/
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run()
