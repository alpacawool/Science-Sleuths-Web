from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin

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

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()