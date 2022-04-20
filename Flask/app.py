from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv


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