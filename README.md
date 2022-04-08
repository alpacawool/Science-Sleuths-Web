# Science Sleuths Web Admin Portal
https://sleuths.herokuapp.com/

## Table of Contents

- [Requirements](#requirements)
- [Installation - Windows 10](#installation)
- [Heroku Deployment](#heroku)

## Requirements
```
Python 3.10.4
Node 17.9.0
npm 8.5.5
```

## Installation
### Local Environment - Windows 10

#### Setting up a virtual environment (Optional)
1.	Open terminal and type following command:
```
pip install virtualenv
```
2.	Navigate to root project directory \Science-Sleuths-Web and enter below. A new folder will be created name env.
```
virtualenv env
```
3.	Turn on virtual environment:
```
env\Scripts\activate
```
4.	If you want to close the virtual environment:
```
Deactivate
```

### Flask Setup
1.	Install required python packages:
```
pip install -r requirements.txt
```
2.	In terminal, navigate into the Flask directory \Science-Sleuths-Web\Flask
3.	Create a file called .env . This will store all environmental variables. 
```
FLASK_APP=app.py
FLASK_ENV=production
```
4.	Start flask:
```
Flask run
```
### React Setup

1.	In terminal, navigate into the React directory \Science-Sleuths-Web\Flask\react-sleuths
2.	In package.json, update the proxy attribute to your localhost similar to below: 
```json
  "proxy": "http://127.0.0.1:5000",
```
3.	Install required packages:
```
npm install
```
4.	Start React
```
npm start
```

### Notes
- ``npm start`` will run the development build. This mode includes auto-refresh for any react code changes. It will draw data from flask but if any flask code changes, flask will need to be restarted
- ``npm run build`` will create a new production build. This will capture the latest development code and update the build folder. ``Flask run`` draws from the build folder.

## Heroku
- If intending to test on Heroku, update proxy in package.json to the following:
```json
"proxy": "https://sleuths.herokuapp.com",
```
- Then run ``npm run build`` to confirm changes
- Only one branch at a time can run on Heroku. Switch the branch that is intended to test.

