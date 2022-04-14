import {useState} from 'react';
import {v4} from 'uuid'

import TextField from "@mui/material/TextField";
import Input from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';

import './NewProjectForm.scss'
import { SubmitFormButton } from './SubmitFormButton/SubmitFormButton';

export const NewProjectForm = () => {

  // Initialize one question in array of questions
  const [questions, setQuestions] 
    = useState([
      <QuestionBox 
      id={v4(4)}
    />
    ]);
  
  function addQuestion() {
    setQuestions([...questions, 
      <QuestionBox 
        id={v4(4)}
      />]);
  }

  function deleteQuestion(id) {
    const newQuestions = questions.filter(i => i.props.id !== id);
    setQuestions(newQuestions);
  }

  function submitProjectForm() {
    console.log("Here's your new project :)")
  }


  return (
    <form className="new-project-form">
        <Input
            fullWidth
            margin="normal"
            placeholder="Your project name goes here.."  
            variant="standard"
            disableUnderline={true}
            className="project-name-field"
            
        />
        <TextField 
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
            quantity={questions.length}
            deleteHandler={deleteQuestion}
          /> ))} 

        <AddQuestionButton clickHandler={addQuestion} />
        <SubmitFormButton clickHandler={submitProjectForm}/>
    </form>
  )
}
