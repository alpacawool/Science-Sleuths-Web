/**
 * NewProjectForm.jsx
 * Form for creating a new project
 */
import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {v4} from 'uuid'

import TextField from "@mui/material/TextField";
import Input from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';
import { SubmitFormButton } from './SubmitFormButton/SubmitFormButton';

import { 
  projectFormValidator,
  multipleChoiceFormValidator,
  entireNewProjectValidator 
} from './../../utilities/js/inputValid.js'


import './NewProjectForm.scss'

export const NewProjectForm = () => {

  let navigate = useNavigate();

  const location = useLocation();
  const user_id = location.state.user_id;
  const display_name = location.state.display_name;

  // Project State Functions
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    owner_id: user_id,
    questions: [],
    error_message: {}
  });

  const handleProjectChange = e => {
    const { name, value } = e.target;
    setNewProject(prevNewProject => ({
        ...prevNewProject,
        [name]: value,
        ['error_message']: {...prevNewProject.error_message,
          [name]: projectFormValidator(name, value)
        }
    }));
  };

  const updateQuestionList = (index, questionToAdd) => {
    let newQuestions = [...newProject.questions];
    newQuestions[index] = questionToAdd;

    setNewProject(prevNewProject => ({
      ...prevNewProject,
      ['questions']: newQuestions
    }));
  }


  // Question Component Display functions 

  // Initialize one QuestionBox component (div) in array of questions
  const [questions, setQuestions] 
    = useState([
      <QuestionBox 
      id={v4(4)}
    />
    ]);
  
  // Insert a new QuestionBox div with inputs
  function addQuestion() {
    setQuestions([...questions, 
      <QuestionBox 
        id={v4(4)}
      />]);
  }

  // Remove QuestionBox div
  function deleteQuestion(id, index) {
    const newQuestions = questions.filter(i => i.props.id !== id);
    setQuestions(newQuestions);
    // Update Project value state (remove from Project.questions array)
    setNewProject(prevNewProject => ({
      ...prevNewProject,
      ['questions']: prevNewProject.questions.filter((item, itemIndex) => itemIndex !== index)
    }))
  }

  // Input validation
  const checkFormFields = () => {

    const currentQuestions = newProject.questions

    for (var i = 0; i < currentQuestions.length; i++) {
      currentQuestions[i].error_message['prompt'] = 
        projectFormValidator('prompt', currentQuestions[i].prompt)
      
       // Check ranged question (1, 2)
      if (currentQuestions[i].type === 1 || currentQuestions[i].type === 2) {
        if (currentQuestions[i].set_range === true) {
          currentQuestions[i].error_message['range_min'] = 
            projectFormValidator('range_min', currentQuestions[i].range_min)
          currentQuestions[i].error_message['range_max'] = 
            projectFormValidator('range_max', currentQuestions[i].range_max)
        }
      } 

      // Check multiple choice
      if (currentQuestions[i].type === 3) {
        for (var j = 0; j < 4 ; j++) {
          currentQuestions[i].error_message[`choice${j}`] = 
          multipleChoiceFormValidator(currentQuestions[i].choices[j], j)
        }
      } 
      
  
    }
    setNewProject(prevNewProject => ({
      ...prevNewProject,
      ['error_message']: {...prevNewProject.error_message,
        ['title']: projectFormValidator('title', prevNewProject.title),
        ['description']: projectFormValidator('description', prevNewProject.description),
      },
      ['questions'] : currentQuestions
    }));
  }

  function submitProjectForm() {
    // Show error messages on empty fields
    checkFormFields();
    // Check field data and validate it
    let isValid = entireNewProjectValidator(newProject)

    if (!isValid) {
      console.log("Fields are still incorrect")
    } else {
      console.log("No problems with fields!")
    }
    // Clickhandler logic for submit Button
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(newProject)
    // };
    // fetch('/create-new-project', requestOptions)
    //   .then(response => {
    //     if (response.status === 200) {
    //       // Navigate to projects page
    //       navigate("/dash/projects", {
    //         state: { user_id: user_id, display_name: display_name },
    //       });
    //     }
    //   })
    //   .then(error => console.log(error))
  }

  return (
    <form className="new-project-form">
        <Input
            value={newProject.title}
            name="title"
            onChange={handleProjectChange}
            fullWidth
            margin="normal"
            placeholder="Your project name goes here.."  
            variant="standard"
            className="project-name-field"
            error={!!newProject.error_message.title}
            helperText= {
              newProject.error_message.title
            }
            required
            
        />
        <TextField
            value={newProject.description}
            name="description"
            onChange={handleProjectChange}
            fullWidth 
            margin="normal" 
            label="Description" 
            variant="outlined" 
            multiline={true}
            error={!!newProject.error_message.description}
            helperText= {
              newProject.error_message.description
            }
            required
        />
  
        {questions.map((question, index) => ( 
          <QuestionBox 
            key={questions[index].props.id}
            id={questions[index].props.id}
            index={index}
            quantity={questions.length}
            deleteHandler={deleteQuestion}
            handleProjectChange={handleProjectChange}
            updateQuestionList={updateQuestionList}
          /> ))} 

        <AddQuestionButton clickHandler={addQuestion} />
        <SubmitFormButton clickHandler={submitProjectForm}/>
    </form>
  )
}
