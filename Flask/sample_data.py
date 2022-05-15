# Generate test data
from faker import Faker
from models import *

fake = Faker()

def generate_random_project(user_id):
    '''
    Generates a random project for user
    Returns the newly created project_id
    '''

    # Create Project
    random_title = fake.catch_phrase()
    random_desc = fake.paragraph(
        nb_sentences=20, variable_nb_sentences= True)

    new_project = Project(
        user_id, random_title, random_desc
    )

    # Have every question type for sample data
    question_types = ['True or False', 'Whole Number',
        'Decimal', 'Multiple Choice', 'Text', 'Date']
    choice_list = [fake.word() for i in range(4)]

    question_prompts = [
        f'{question_types[i]}: {fake.text(max_nb_chars=80)[:-1]}?' 
            for i in range(6)
    ]

    for i in range(0, 6):
        choices = []
        if i == 3:
            choices = [fake.word() for i in range(4)]
        new_question = Question(i+1, question_prompts[i], i,
            choices, None, None
        )
        new_project.add_question(new_question)
    
    # Create project
    new_project_id = create_project(new_project)

    # Add 20 sample observations
    for i in range(0, 20):
        observation = Observation(new_project_id, fake.lexify(text='????????'),
        fake.first_name(), fake.last_name(), 
        f'{fake.word().capitalize()} {fake.word().capitalize()}',
        fake.date_time_between())

        # Add responses
        answers=[
            fake.pybool(),
            fake.pyint(min_value=0, max_value=100),
            fake.pyfloat(right_digits=2, min_value=0, max_value=100),
            fake.pyint(min_value=0, max_value=3),
            fake.text(max_nb_chars=50),
            fake.date_time_between()
        ]
        for i in range(0, 6):
            response=Response(i+1, i, answers[i])
            observation.add_response(response)
        
        create_observation(new_project_id, observation)
    
    return new_project_id


