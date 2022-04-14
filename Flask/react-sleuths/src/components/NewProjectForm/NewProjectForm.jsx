import {useState} from 'react';
import {v4} from 'uuid'

import TextField from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';

import './NewProjectForm.scss'

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


  return (
    <form className="new-project-form">
        <TextField 
            fullWidth 
            margin="normal"
            placeholder="Your project name goes here.."  
            variant="outlined"
        />
        <TextField 
            fullWidth 
            margin="normal" 
            label="Description" 
            variant="outlined" 
        />
  
        {questions.map((question, index) => ( 
          <QuestionBox 
            key={questions[index].props.id}
            id={questions[index].props.id}
            deleteHandler={deleteQuestion}
          /> ))} 

        <AddQuestionButton clickHandler={addQuestion} />
        
       

    </form>
  )
}
