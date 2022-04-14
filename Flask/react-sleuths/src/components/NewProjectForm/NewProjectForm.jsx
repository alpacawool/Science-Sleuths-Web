import {useState} from 'react';

import TextField from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';

import './NewProjectForm.scss'

export const NewProjectForm = () => {

  const [questions, setQuestions] = useState([]);
  
  function addQuestion() {
    setQuestions([...questions, <QuestionBox />]);
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
        <QuestionBox/>
        {questions.map((i, index) => ( <QuestionBox key={index} /> ))} 
        <AddQuestionButton clickHandler={addQuestion} />
        
       
        {/* <Grid container>
            <Grid item xs={12}>

            </Grid>
        </Grid> */}


    </form>
  )
}
