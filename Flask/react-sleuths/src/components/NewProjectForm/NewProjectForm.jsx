/**
 * NewProjectForm.jsx
 * Form for creating a new project
 */
import {useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {v4} from 'uuid'

import TextField from "@mui/material/TextField";
import Input from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';
import { SubmitFormButton } from './SubmitFormButton/SubmitFormButton';


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
    questions: []
  });

  const handleProjectChange = e => {
    const { name, value } = e.target;
    setNewProject(prevNewProject => ({
        ...prevNewProject,
        [name]: value
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

  function submitProjectForm() {
    // Clickhandler logic for submit Button
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newProject)
    };
    fetch(`/users/${user_id}/projects/create`, requestOptions)
      .then(response => {
        if (response.status === 200) {
          // Navigate to projects page
          navigate("/dash/projects", {
            state: { user_id: user_id, display_name: display_name },
          });
        }
      })
      .then(error => console.log(error))
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
