import os
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from typing import List
import csv

load_dotenv()

key_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

# valid question/answer types
BOOLEAN = 0
INTEGER = 1
FPN = 2
MULTIPLE_CHOICE = 3
TEXT = 4
DATETIME = 5


# TODO: Add error checking for functions (if db cannot be updated, return msg)

class InvalidQuestionTypeError(Exception):
    pass


class InvalidResponseTypeError(Exception):
    pass


class User:
    """
    A base class representing the top-level collection Users. Not used
    directly - use the Student or Teacher classes instead.
    """
    def __init__(self, first_name: str, last_name: str):
        self.first_name = first_name
        self.last_name = last_name

    @staticmethod
    def from_dict(source: dict) -> "User":
        user = User(source[u'first_name'], source[u'last_name'])
        return user

    def to_dict(self) -> dict:
        dest = {
            u'first_name': self.first_name,
            u'last_name': self.last_name
        }
        return dest


class Student(User):
    """
    A class representing a user (student) document in the top-level collection
    Users.
    """
    def __init__(self, first_name: str, last_name: str):
        super().__init__(first_name, last_name)
        self.is_admin = False

    @staticmethod
    def from_dict(source: dict) -> "Student":
        user = Student(source[u'first_name'], source[u'last_name'])
        return user

    def to_dict(self) -> dict:
        dest = {
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'is_admin': self.is_admin
        }
        return dest


class Teacher(User):
    """
    A class representing a user (teacher) document in the top-level collection
    Users.
    """
    def __init__(self, first_name: str, last_name: str, email: str,
                 hashed_pwd: str, is_admin: bool = True,
                 owned_projects: List = None):
        super().__init__(first_name, last_name)
        self.email = email
        self.is_admin = is_admin
        self.hashed_pwd = hashed_pwd
        if owned_projects is None:
            self.owned_projects = []
        else:
            self.owned_projects = owned_projects

    @staticmethod
    def from_dict(source: dict) -> "Teacher":
        user = Teacher(source[u'first_name'], source[u'last_name'],
                       source[u'email'], source[u'hashed_pwd'])

        if u'is_admin' in source:
            user.is_admin = source[u'is_admin']

        if u'owned_projects' in source:
            for project_summary_dict in source[u'owned_projects']:
                project_summary = \
                    ProjectSummary.from_dict(project_summary_dict)
                user.owned_projects.append(project_summary)

        return user

    def to_dict(self) -> dict:
        dest = {
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'email': self.email,
            u'hashed_pwd': self.hashed_pwd,
            u'is_admin': self.is_admin,
            u'owned_projects': [project_summary.to_dict() for project_summary
                                in self.owned_projects]
        }
        return dest

    def add_owned_project(self, project_summary: "ProjectSummary"):
        self.owned_projects.append(project_summary)

    def remove_owned_project(self, project_id: str):
        for project_summary in self.owned_projects:
            if project_summary.project_id == project_id:
                self.owned_projects.remove(project_summary)


class ProjectSummary:
    """
    A class representing a ProjectSummary object that is part of each user
    (teachers only) document in the top-level collection Users.
    """
    def __init__(self, project_id: str, title: str, description: str):
        self.project_id = project_id
        self.title = title
        self.description = description

    @staticmethod
    def from_dict(source: dict) -> "ProjectSummary":
        proj = ProjectSummary(source[u'project_id'], source[u'title'],
                              source[u'description'])
        return proj

    def to_dict(self) -> dict:
        dest = {
            u'project_id': self.project_id,
            u'title': self.title,
            u'description': self.description
        }
        return dest


class Project:
    """
    A class representing a project document in the top-level collection
    Projects.
    """
    def __init__(self, owner_id: str, title: str, description: str,
                 questions: List = None):
        self.owner_id = owner_id
        self.title = title
        self.description = description
        if questions is None:
            self.questions = []  # contains Question objects
        else:
            self.questions = questions

    @staticmethod
    def from_dict(source: dict) -> "Project":
        proj = Project(source[u'owner_id'], source[u'title'],
                       source[u'description'])

        if u'questions' in source:
            for question_dict in source[u'questions']:
                question = Question.from_dict(question_dict)
                proj.questions.append(question)

        return proj

    def to_dict(self) -> dict:
        dest = {
            u'owner_id': self.owner_id,
            u'title': self.title,
            u'description': self.description,
            u'questions': [question.to_dict() for question in self.questions]
        }
        return dest

    def add_question(self, question: "Question"):
        self.questions.append(question)

    def remove_question(self, question_num: int):
        for question in self.questions:
            if question.question_num == question_num:
                self.questions.remove(question)

    def get_owner_id(self):
        return self.owner_id

    def get_title(self):
        return self.title

    def get_description(self):
        return self.description


class Question:
    """
    A class representing a Question object that is part of each project
    document in the top-level collection Projects.
    """
    def __init__(self, question_num, prompt: str, question_type: int,
                 choices: List = None, range_min: int = None,
                 range_max: int = None):
        self.question_num = question_num
        self.prompt = prompt
        self.type = question_type
        if choices is None:
            self.choices = []
        else:
            self.choices = choices
        self.range_min = range_min
        self.range_max = range_max

    @staticmethod
    def from_dict(source: dict) -> "Question":
        question = Question(source[u'question_num'], source[u'prompt'],
                            source[u'type'])

        if u'choices' in source:
            question.choices = source[u'choices']

        if u'range_min' in source:
            question.range_min = source[u'range_min']

        if u'range_max' in source:
            question.range_max = source[u'range_max']

        return question

    def to_dict(self):
        dest = {
            u'question_num': self.question_num,
            u'prompt': self.prompt,
            u'type': self.type,
            u'choices': self.choices,
            u'range_min': self.range_min,
            u'range_max': self.range_max
        }

        return dest

    def set_choices(self, choices: List):
        """
        Sets choices to a MULTIPLE_CHOICE question
        :param choices: a list of choices
        """
        if self.type != MULTIPLE_CHOICE:
            print("Can't add choices to non MULTIPLE_CHOICE type question.")
            raise InvalidQuestionTypeError
        self.choices = choices

    def set_range_min(self, min_val: int):
        self.range_min = min_val

    def set_range_max(self, max_val: int):
        self.range_max = max_val


class Observation:
    """
    A class representing an observation document in the sub-collection
    Observations.
    """
    def __init__(self, project_id: str, author_id: str, first_name: str,
                 last_name: str, title: str, date_time=None):
        self.project_id = project_id
        self.author_id = author_id
        self.first_name = first_name
        self.last_name = last_name
        self.title = title
        self.datetime = date_time  # set by calling function upon creation
        self.responses = []  # contains response objects

    @staticmethod
    def from_dict(source: dict) -> "Observation":
        observation = Observation(source[u'project_id'], source[u'author_id'],
                                  source[u'first_name'], source[u'last_name'],
                                  source[u'title'])

        if u'datetime' in source:
            observation.datetime = source[u'datetime']

        if u'responses' in source:
            for response_dict in source[u'responses']:
                response = Response.from_dict(response_dict)
                observation.responses.append(response)

        return observation

    def to_dict(self) -> dict:
        dest = {
            u'project_id': self.project_id,
            u'author_id': self.author_id,
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'title': self.title,
            u'datetime': self.datetime,
            u'responses': [response.to_dict() for response in self.responses]
        }

        return dest

    def add_response(self, response: "Response"):
        """
        Adds a Response object to the responses.
        """
        self.responses.append(response)

    def remove_response(self, question_num: int):
        for response in self.responses:
            if response.question_num == question_num:
                self.responses.remove(response)

    def set_datetime(self, date_time):
        self.datetime = date_time


class Response:
    """
    A class representing a Response object that is part of each observation
    document in the sub-collection Observations.
    """
    def __init__(self, question_num: int, question_type: int, response):
        self.question_num = question_num
        self.type = question_type
        self.response = response  # response is variable depending on type

    @staticmethod
    def from_dict(source: dict) -> "Response":
        response = Response(source[u'question_num'], source[u'type'],
                            source[u'response'])

        return response

    def to_dict(self) -> dict:
        dest = {
            u'question_num': self.question_num,
            u'type': self.type,
            u'response': self.response
        }

        return dest

    def edit_response(self, response):
        self.response = response

    def remove_response(self):
        self.response = None


def create_student(student: "Student") -> str:
    """
    Takes a Student instance and adds it to Firestore db
    :param student: the Student instance
    :return: the user_id
    """
    db = firestore.client()
    student_ref = db.collection(u'Users').add(student.to_dict())

    return student_ref[1].id


def create_teacher(teacher: "Teacher") -> str:
    """
    Takes a Teacher instance and adds it to Firestore db
    :param teacher: the Teacher instance
    :return: the user_id
    """
    db = firestore.client()
    teacher_ref = db.collection(u'Users').add(teacher.to_dict())

    return teacher_ref[1].id


def modify_teacher_email(user_id: str, email: str):
    """
    Modifies the teacher's email address for the given user_id.
    :param user_id: the user_id of the teacher to modify
    :param email: the new email address
    """
    db = firestore.client()

    return db.collection(u'Users').document(user_id).update({u'email': email})


def modify_teacher_hashed_pwd(user_id: str, hashed_pwd: str):
    """
    Modifies the teacher's hashed_pwd for the given user_id.
    :param user_id: the user_id of the teacher to modify
    :param hashed_pwd: the new hashed password
    """
    db = firestore.client()

    return db.collection(u'Users').document(user_id)\
        .update({u'hashed_pwd': hashed_pwd})


def remove_user(user_id: str):
    """
    Takes a user_id and removes the user from Firestore db
    :param user_id: the user_id to delete
    """
    db = firestore.client()

    return db.collection(u'Users').document(user_id).delete()


def create_project(project: "Project") -> str:
    """
    Takes a Project instance and adds it to Firestore db. Creates a Project
    Summary instance and adds it to the project's owner.
    :param project: the Project instance
    :return: the project_id
    """
    db = firestore.client()
    project_ref = db.collection(u'Projects').document()
    project_id = project_ref.id
    project_ref.set(project.to_dict())

    # create and add project summary to the project owner
    project_summary = ProjectSummary(project_id, project.get_title(),
                                     project.get_description())
    db.collection(u'Users').document(project.get_owner_id()) \
        .update({u'owned_projects': firestore
                .ArrayUnion([project_summary.to_dict()])})

    return project_ref.id


def _delete_collection(coll_ref, batch_size=50):
    """
    Deletes a collection recursively by sending individual delete requests.
    :param coll_ref:
    :param batch_size:
    :return:
    """
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return _delete_collection(coll_ref, batch_size)


def delete_project(project_id: str, owner_id: str):
    """
    Takes a project_id and deletes it from Firestore db. Also deletes the
    subcollection Observations and any existing documents in it along with the
    project summary from the owner_id.
    :param project_id: the project_id to delete
    :param owner_id: the user_id of the owner of the project to delete
    """
    db = firestore.client()

    # delete all docs in the subcollection Observations from the project
    obs_ref = db.collection(u'Projects').document(project_id)\
        .collection(u'Observations')
    _delete_collection(obs_ref)

    # delete the project
    db.collection(u'Projects').document(project_id).delete()

    # query for the project summary from the owner
    proj_owner = db.collection(u'Users').document(owner_id).get()
    if proj_owner.exists:
        owned_projects = proj_owner.to_dict()['owned_projects']
        for project in owned_projects:
            if project['project_id'] == project_id:
                # remove the project summary from owned_projects
                owned_projects.remove(project)
        # delete the project summary from the owner
        db.collection(u'Users').document(owner_id).\
            update({u'owned_projects': owned_projects})
    else:
        print(u'No such user exists!')


def modify_project_title(project_id: str, title: str):
    """
    Modifies the project title.
    :param project_id: the project_id of the project to modify
    :param title: the new title
    """
    db = firestore.client()

    db.collection(u'Projects').document(project_id).update({u'title': title})


def modify_project_description(project_id: str, description: str):
    """
    Modifies the project description.
    :param project_id: the project_id of the project to modify
    :param description: the new description
    """
    db = firestore.client()

    db.collection(u'Projects').document(project_id)\
        .update({u'description': description})


def add_question_to_project(project_id: str, question: "Question"):
    """
    Adds the given Question instance to the project with project_id.
    :param project_id: the project_id to add the question to
    :param question: the Question instance to add
    """
    db = firestore.client()

    db.collection(u'Projects').document(project_id) \
        .update({u'questions': firestore
                .ArrayUnion([question.to_dict()])})


def remove_question_from_project(project_id: str, question_num: int):
    """
    Deletes the specified question_num from the project_id.
    :param project_id: the project_id of the project to remove from
    :param question_num: the number of the question to remove
    """
    db = firestore.client()

    # query for the project
    proj = db.collection(u'Projects').document(project_id).get()
    if proj.exists:
        questions = proj.to_dict()['questions']
        question_found = False
        for question in questions:
            if question['question_num'] == question_num:
                # remove the question from questions
                questions.remove(question)
                question_found = True
        if question_found is False:
            print(u'No such question exists!')
            return
        # delete the question from the project
        db.collection(u'Projects').document(project_id). \
            update({u'questions': questions})
    else:
        print(u'No such project exists!')


def create_observation(project_id: str, observation: "Observation") -> str:
    """
    Takes an Observation instance and adds it to the associated project_id
     in Firestore db
    :param project_id: the project_id to add the observation to
    :param observation: the Observation instance
    :return: observation_id
    """
    db = firestore.client()
    # set the observation datetime to current datetime
    observation.set_datetime(datetime.datetime.now())
    obs_ref = db.collection(u'Projects').document(project_id) \
        .collection(u'Observations').add(observation.to_dict())

    return obs_ref[1].id


def get_all_project_details(user_id: str) -> List["ProjectSummary"]:
    """
    Retrieves all project details owned by the specified user_id.
    :param user_id: the user_id
    :return: A list of ProjectSummary objects
    """
    db = firestore.client()

    # query for the user
    proj_owner = db.collection(u'Users').document(user_id).get()
    if proj_owner.exists:
        owned_projects = []
        for project in proj_owner.to_dict()[u'owned_projects']:
            project_summary = ProjectSummary.from_dict(project)
            owned_projects.append(project_summary)
        return owned_projects
    print(u'No such user exists!')


def get_all_project_observations(project_id: str) -> List["Observation"]:
    """
    Retrieves all observations in a given project_id
    :param project_id: the project_id
    :return: a list of Observation objects
    """
    db = firestore.client()

    obs_stream = db.collection(u'Projects').document(project_id)\
        .collection(u'Observations').stream()
    observations = []
    for obs in obs_stream:
        # convert to Observation
        observations.append(Observation.from_dict(obs.to_dict()))
    return observations


def write_project_to_file(project_id: str, filepath: str):
    """
    Writes project to a csv file with the chosen filename.
    :param project_id: the project_id of the project
    :param filepath: the filepath to write to
    :return:
    """
    db = firestore.client()

    obs_stream = db.collection(u'Projects').document(project_id)\
        .collection(u'Observations').stream()

    title = [{"project_id": project_id}]
    header = ['author_id', 'first_name', 'last_name', 'title', 'datetime',
              'question_num', 'type', 'response']
    with open(filepath, 'w', encoding='UTF8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(title)
        writer.writerow(header)

        for obs in obs_stream:
            obs_dict = obs.to_dict()
            for response in obs_dict['responses']:
                data = []
                data.append(obs_dict['author_id'])
                data.append(obs_dict['first_name'])
                data.append(obs_dict['last_name'])
                data.append(obs_dict['title'])
                data.append(obs_dict['datetime'])
                data.append(response['question_num'])
                data.append(response['type'])
                data.append(response['response'])
                writer.writerow(data)


def add_example_data():
    """
    Creates some example data using the classes/functions above.
    """
    # create & add three students
    num_students = 3
    student_first_names = ["Jane", "John", "Mickey"]
    student_last_names = ["Doe", "Deere", "Mouse"]
    student_ids = []
    for i in range(num_students):
        student = Student(student_first_names[i], student_last_names[i])
        student_ids.append(create_student(student))

    # create & add three teachers
    num_teachers = 3
    teacher_first_names = ["Marie", "Joseph", "David"]
    teacher_last_names = ["Curie", "Heller", "Johnson"]
    emails = ["mariecurie@test.com", "josephheller@test.com",
              "davidjohnson@test.com"]
    hashed_pwds = ["BLAH1234", "abcdefg", "somehash"]
    teacher_ids = []

    for i in range(num_teachers):
        teacher = Teacher(teacher_first_names[i], teacher_last_names[i],
                          emails[i], hashed_pwds[i])
        teacher_ids.append(create_teacher(teacher))

    # create & add three projects
    num_projects = 3
    titles = ["Study of B. oleracea", "Better Betta Fish", "Birdwatching Log"]
    descriptions = ["In this three week exploration, we will be gathering...",
                    "Color pattern observations in Siamese Fighting...",
                    "Please submit all birds spotted HERE. IMPORTANT..."]

    # with three questions per project
    num_questions = 3
    prompts = [["Describe weather...",
                "Provide height start...",
                "How many lea..."],
               ["Describe fish pattern...",
                "Choose the correct...",
                "What time of day did..."],
               ["What is your favorite...",
                "How many birds do you...",
                "True or false..."]]
    types = [[TEXT, FPN, INTEGER],
             [TEXT, MULTIPLE_CHOICE, DATETIME],
             [TEXT, INTEGER, BOOLEAN]]
    choices = [[None, None, None],
               [None, ["Siamese fighting fish", "Peaceful betta",
                       "Betta smargadina", "Spotfin betta"], None],
               [None, None, None]]
    project_ids = []

    # create each project and add questions
    for i in range(num_projects):
        project = Project(teacher_ids[i], titles[i], descriptions[i])
        for j in range(num_questions):
            project.add_question(Question(j + 1, prompts[i][j], types[i][j],
                                          choices[i][j]))
        project_ids.append(create_project(project))

    # create one more project for testing
    project = Project(teacher_ids[2], "A testing testful test",
                      "For testing to see if ArrayUnion works")
    for i in range(num_questions):
        project.add_question(Question(i + 1, prompts[0][i], types[0][i],
                                      choices[0][i]))
    project_ids.append(create_project(project))

    project_responses = [[["Sunny...", 4.25, 3],
                          ["Rainy...", 2.74, 8],
                          ["Cloudy...", 24.2, 12]],
                         [["Shiny...", 0, datetime.datetime.now()],
                          ["Gray...", 2, datetime.datetime.now()],
                          ["Blue...", 2, datetime.datetime.now()]],
                         [["The great horned owl", 12, False],
                          ["American Eagle", 7, True],
                          ["Nothing", 8, True]]]

    # create one observation per student per project
    for i in range(num_projects):
        for j in range(len(student_ids)):
            observation = Observation(project_ids[i], student_ids[j],
                                      student_first_names[j],
                                      student_last_names[j],
                                      "test title")
            # number of questions per observation
            for k in range(num_questions):
                response = Response(k + 1, types[i][k],
                                    project_responses[i][j][k])
                observation.add_response(response)
            create_observation(project_ids[i], observation)


if __name__ == "__main__":
    user_id = "Iw9BIoRWI4cVUb9BHTDI"
    project_id = "7RPNXZgpXeXSNHSKEaEe"

