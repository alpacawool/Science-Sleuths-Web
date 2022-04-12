import os
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
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
            user.owned_projects = source[u'owned_projects']

        return user

    def to_dict(self) -> dict:
        dest = {
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'email': self.email,
            u'hashed_pwd': self.hashed_pwd,
            u'is_admin': self.is_admin,
            u'owned_projects': self.owned_projects
        }
        return dest

    def add_owned_project(self):
        pass


class ProjectSummary:
    def __init__(self, project_id: str, title: str, description: str,
                 num_questions: int):
        self.project_id = project_id
        self.title = title
        self.description = description
        self.num_questions = num_questions

    @staticmethod
    def from_dict(source: dict) -> "ProjectSummary":
        proj = ProjectSummary(source[u'project_id'], source[u'title'],
                              source[u'description'], source[u'num_questions'])
        return proj

    def to_dict(self) -> dict:
        dest = {
            u'project_id': self.project_id,
            u'title': self.title,
            u'description': self.description,
            u'num_questions': self.num_questions,
        }
        return dest


class Project:
    def __init__(self, owner_id, title, description):
        self.owner_id = owner_id
        self.title = title
        self.description = description
        self.total_observations = 0
        self.student_members = []
        self.questions = []

    @staticmethod
    def from_dict(source):
        proj = Project(source[u'owner_id'], source[u'title'],
                       source[u'description'])

        if u'total_observations' in source:
            proj.total_observations = source[u'total_observations']

        if u'student_members' in source:
            proj.student_members = source[u'student_members']

        if u'questions' in source:
            proj.questions = source[u'questions']

        return proj

    def to_dict(self):
        dest = {
            u'owner_id': self.owner_id,
            u'title': self.title,
            u'description': self.description,
            u'total_observations': self.total_observations,
            u'student_members': self.student_members,
            u'questions': [question.to_dict() for question in self.questions]
        }
        return dest

    def add_question(self, question: "Question"):
        self.questions.append(question)

    def add_student_member(self, user_id):
        self.student_members.append(user_id)

    def increment_total_observations(self, num):
        self.total_observations += num


class Question:
    def __init__(self, question_num: int, prompt: str, question_type: int,
                 choices: List[int] = None, range_min: int = None,
                 range_max: int = None):
        self.question_num = question_num
        self.prompt = prompt
        self.type = question_type
        self.choices = choices
        self.range_min = range_min
        self.range_max = range_max

    @staticmethod
    def from_dict(source):
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

    def add_choices(self, choices):
        """
        Adds choices to a MULTIPLE_CHOICE question
        :param choices: a list of choices
        """
        if self.type != MULTIPLE_CHOICE:
            print("Can't add choices to non MULTIPLE_CHOICE type question.")
            raise InvalidQuestionTypeError
        if self.choices is None:
            self.choices = []
        for choice in choices:
            self.choices.append(choice)

    def set_range_min(self, min_val):
        self.range_min = min_val

    def set_range_max(self, max_val):
        self.range_max = max_val


class Observation:
    def __init__(self, author_id, first_name, last_name, title):
        self.author_id = author_id
        self.first_name = first_name
        self.last_name = last_name
        self.title = title
        self.datetime = datetime.datetime.now()
        self.observation = []

    @staticmethod
    def from_dict(source):
        observation = Observation(source[u'author_id'], source[u'first_name'],
                                  source[u'last_name'], source[u'title'])

        if u'datetime' in source:
            observation.datetime = source[u'datetime']

        if u'observation' in observation:
            observation.observation = source[u'observation']

        return observation

    def to_dict(self):
        dest = {
            u'author_id': self.author_id,
            u'first_name': self.first_name,
            u'last_name': self.last_name,
            u'title': self.title,
            u'datetime': self.datetime,
            u'observation': self.observation
        }
        return dest

    def add_response(self, response):
        """
        Adds a Response object to the observation.
        """
        pass

    def remove_response(self, question_num):
        pass

    def edit_response(self, question_num):
        pass


class Response:
    def __init__(self, question_num, question_type, response):
        self.question_num = question_num
        self.type = question_type
        self.response = response

    @staticmethod
    def from_dict(source):
        response = Response(source[u'question_num'], source[u'type'],
                            source[u'response'])

        return response

    def to_dict(self):
        dest = {
            u'question_num': self.question_num,
            u'type': self.type,
            u'response': self.response
        }
        return dest

    def __repr__(self):
        return (
            f'Response(\n\tquestion_num={self.question_num}, \n\t'
            f'type={self.type}, \n\t'
            f'response={self.response}, \n\t'
            f')'
        )

    def add_response(self, response):
        """
        Adds a Response object to the observation.
        """
        pass

    def remove_response(self, question_num):
        pass

    def edit_response(self, question_num):
        pass


def add_example_data():
    db = firestore.client()

    users_ref = db.collection(u'Users')
    projects_ref = db.collection(u'Projects')

    # create & add three students
    student_1 = Student("Jane", "Doe")
    users_ref.add(student_1.to_dict())
    student_2 = Student("John", "Doe")
    users_ref.add(student_2.to_dict())
    student_3 = Student("Mickey", "Mouse")
    users_ref.add(student_3.to_dict())

    # create & add three teachers
    teacher_1 = Teacher("Marie", "Fitzgerald",
                        email="mariefitzgerald@test.com",
                        hashed_pwd="BLAH24t2")
    teacher_1_ref = users_ref.add(teacher_1.to_dict())
    teacher_2 = Teacher("Joseph", "Dunkin", email="josephdunkin@test.com",
                        hashed_pwd="ADGBIOWEKDGO")
    teacher_2_ref = users_ref.add(teacher_2.to_dict())
    teacher_3 = Teacher("David", "Anderson", email="davidanderson@test.com",
                        hashed_pwd="Aasdpghq12werDgd")
    teacher_3_ref = users_ref.add(teacher_3.to_dict())

    # create & add three projects
    teacher_1_id = teacher_1_ref.get().id
    print("teacher-1 id (marie fitzgerald) = {}".format(teacher_1_id))
    project_1 = Project(teacher_1_ref.get().id)


if __name__ == "__main__":
    db = firestore.client()
    teacher_4 = Teacher("Donald", "Duck", email="donaldduck@test.com",
                        hashed_pwd="Aasdpghq12werDgdaew")
    teacher_4_ref = db.collection(u'Users').add(teacher_4.to_dict())
    teacher_4_id = teacher_4_ref[1].get().id
    print("teacher_4_id (marie fitzgerald) = {}".format(teacher_4_id))
    project_1 = Project(teacher_4_id,
                        "Observation of Ducks in the Wild",
                        "In this observation, we'll take a look at ducks in "
                        "the wild! Students will analyze duck biology in the "
                        "wild.")
    question_1 = Question(1, "How many ducks are in the pond?", INTEGER)
    question_1.set_range_min(0)
    question_1.set_range_max(50)

    question_2 = Question(2, "What is the average size of a duck? (in grams) ",
                          FPN)
    question_2.set_range_min(0)
    question_2.set_range_max(50000)

    project_1.add_question(question_1)
    project_1.add_question(question_2)

    db.collection(u'Projects').add(project_1.to_dict())
