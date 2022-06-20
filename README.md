# Science Sleuths Web Admin Portal
## Mobile and web application for teacher and student research collaboration
**Bruce Marandino, Timothy Hong, Patricia Booth**

<img src="/readme-pictures/demonstration.gif" width=700><br>

Citizen Science describes community-driven research
where everyday citizens can contribute to science
projects. Science Sleuths aims to be an educational
platform that enables teachers and students to
collaborate on scientific research. A cross-platform
mobile application was developed in Flutter for
students to submit observation data. This provides the
advantage of allowing students to note observations
anywhere they go with any mobile device they have.
Collective observation data is displayed for teachers in
the web portal built in Flask and React. In this portal,
the teachers can manage existing projects, create new
projects, and view detailed project summaries and
relevant statistical information.
Our team was new to many of the technologies used in
the project but we accepted the challenge. We learned
that designing and developing two applications has the
advantage of being independent entities for
separations of concern but it also requires agreement
on methods of communication used so both
applications can send and receive the data seamlessly.
## Table of Contents

- [Features](#features)
- [Design](#design)
- [Requirements](#requirements)
- [Installation - Windows 10](#installation)
- [Heroku Deployment](#heroku)
- [Resources Used](#resources)

## Features
* Initial user authentication through Google Firebase followed by JWT session
authorization on backend

<img src="/readme-pictures/login-signup.png" width=700><br>

* Project management enables analysis of
observation data submitted by displaying a
table summary along with statistical graphs

<img src="/readme-pictures/project-page.PNG" width=700><br>

* New projects can be created with a variable
length of survey questions giving the option
for a variety of data types including true or
false, numeric, short answer, multiple choice,
and date/time

<img src="/readme-pictures/form-types.gif" width=580><br>

* Project data can be exported as a .csv file
allowing users to have an offline copy of
observation results

* Responsive design using CSS media queries and MUI React components
<img src="/readme-pictures/responsive.gif" width=700><br>
## Design

### Database Schema
<img src="/readme-pictures/database-schema.png" width=700><br>
**Answer Types**
```
0 - Boolean
1 - Integer in specified range
2 - Floating point number in specified range
3 - Multiple choice (Four options, one choice is correct)
4 - Text 
5 - Datetime
```

### Wireframes
<img src="/readme-pictures/wireframes.png" width=700><br>

## Requirements
```
Python 3.10.4
Node 17.9.0
npm 8.5.5
Google Firebase - Firestore, Authentication
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
GOOGLE_APPLICATION_CREDENTIALS=
```
4. For ``GOOGLE_APPLICATION_CREDENTIALS``, take the contents of the Firebase .json file and convert it to base64.
5.	Start flask:
```
Flask run
```
### React Setup

1.	In terminal, navigate into the React directory \Science-Sleuths-Web\Flask\react-sleuths (folder name is case sensitive)
2.	In package.json, update the proxy attribute to your localhost similar to below: 
```json
  "proxy": "http://127.0.0.1:5000",
```
3. Set strict SSL to false
```
npm config set strict-ssl false
```

4.	Install required packages:
```
npm install --legacy-peer-deps
```
5.	Start React
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

### Deploying on Heroku using CLI
1. Navigate to root directory. Connect to heroku instance. Authenticate with user credentials.
```
heroku git:remote -a sleuths
```
2. Replace ``BRANCH_NAME`` with branch that is desired to deploy.
```
git push heroku BRANCH_NAME:main
```

### Resources
Resources used for this project:
- Google Firebase
- [MUI 5](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
