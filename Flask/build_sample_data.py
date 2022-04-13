import os
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from typing import List

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


class InvalidQuestionTypeError(Exception):
    pass


class InvalidResponseTypeError(Exception):
    pass


# base class that is extended by the Student & Teacher classes
class User:
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
    def __init__(self, first_name: str, last_name: str, email: str,
                 hashed_pwd: str, is_admin: bool = True):
        super().__init__(first_name, last_name)
        self.email = email
        self.is_admin = is_admin
        self.hashed_pwd = hashed_pwd
        self.owned_projects = []

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
    def __init__(self, owner_id: str, title: str, description: str):
        self.owner_id = owner_id
        self.title = title
        self.description = description
        self.questions = []

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

    def edit_question(self, question_num: int):
        pass

    def get_owner_id(self):
        return self.owner_id

    def get_title(self):
        return self.title

    def get_description(self):
        return self.description


class Question:
    def __init__(self, question_num, prompt: str, question_type: int,
                 choices: List = None, range_min: int = None,
                 range_max: int = None):
        self.question_num = question_num
        self.prompt = prompt
        self.type = question_type
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
    def __init__(self, author_id: str, first_name: str, last_name: str,
                 title: str):
        self.author_id = author_id
        self.first_name = first_name
        self.last_name = last_name
        self.title = title
        self.datetime = datetime.datetime.now()
        self.responses = []  # contains response objects

    @staticmethod
    def from_dict(source: dict) -> "Observation":
        observation = Observation(source[u'author_id'], source[u'first_name'],
                                  source[u'last_name'], source[u'title'])

        # TODO: proper formatting of datetime from dict
        if u'datetime' in source:
            observation.datetime = source[u'datetime']

        if u'observation' in observation:
            for response_dict in source[u'observation']:
                response = Response.from_dict(response_dict)
                observation.responses.append(response)

        return observation

    def to_dict(self) -> dict:
        dest = {
            u'author_id': self.author_id,
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'title': self.title,
            u'datetime': self.datetime,
            u'observation': [response.to_dict() for response in
                             self.responses]
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

    def edit_response(self, question_num: int):
        pass


class Response:
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


def create_student(student: "Student"):
    db = firestore.client()
    student_ref = db.collection(u'Users').add(student.to_dict())
    return student_ref[1].id


def create_teacher(teacher: "Teacher"):
    db = firestore.client()
    teacher_ref = db.collection(u'Users').add(teacher.to_dict())
    return teacher_ref[1].id


def create_project(project: "Project"):
    """
    Takes a Project instance, adds it to the database, and sets the
    auto-generated id.
    :param project: the Project instance
    :return: the Project instance with the auto-generated id set
    """
    db = firestore.client()
    project_ref = db.collection(u'Projects').document()
    project_id = project_ref.id
    project_ref.set(project.to_dict())

    # create and add project summary to the project owner
    project_summary = ProjectSummary(project_id, project.get_title(),
                                     project.get_description())
    db.collection(u'Users').document(project.get_owner_id())\
        .update({u'owned_projects': firestore
                .ArrayUnion([project_summary.to_dict()])})

    return project_ref.id


def create_observation(project_id: str, observation: "Observation"):
    db = firestore.client()
    obs_ref = db.collection(u'Projects').document(project_id)\
        .collection(u'Observations').add(observation.to_dict())
    return obs_ref[1].id


def add_example_data():
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
    for i in range(len(project_ids)):
        for j in range(len(student_ids)):
            observation = Observation(student_ids[j],
                                      student_first_names[j],
                                      student_last_names[j],
                                      "test title")
            # number of questions per observation
            for k in range(3):
                response = Response(k + 1, types[i][k],
                                    project_responses[i][j][k])
                observation.add_response(response)
            create_observation(project_ids[i], observation)


if __name__ == "__main__":
    add_example_data()
