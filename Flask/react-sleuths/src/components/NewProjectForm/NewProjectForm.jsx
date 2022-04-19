import {useState} from 'react';
import {v4} from 'uuid'

import TextField from "@mui/material/TextField";
import Input from "@mui/material/TextField";

import { AddQuestionButton } from './AddQuestionButton/AddQuestionButton';
import { QuestionBox } from './QuestionBox/QuestionBox';
import { SubmitFormButton } from './SubmitFormButton/SubmitFormButton';

import './NewProjectForm.scss'

export const NewProjectForm = () => {

  // Test of getting form data
  const [formValues, setFormValues]  = useState(
    {
      title: '',
      description: '',
    }
  )

  /* According to react convention, it's not recommended to use useState()
   with nested values so it may be better to make question form data a separate
   state. Also read that it may be worth using an immutability helper addon 
   such as https://github.com/kolodny/immutability-helper to handle this */
  const [questionValues, setQuestionValues] = useState(
    [{}]
  )

  // Sample key values of formValues
  const setFormValue = (key, value) => {
    // console.log(`Inserting ${key} : ${value}`)
    // console.log(formValues)
    /* NOTE: Use of set function is required for state management */
    setFormValues(oldFormValues => ({...oldFormValues, [key] : value}));
  };

  const setQuestValues = (index, key, value) => {
    // Stub but my theory of setting the question values
  }


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
  function deleteQuestion(id) {
    const newQuestions = questions.filter(i => i.props.id !== id);
    setQuestions(newQuestions);
    // Should also manage the form question element state as well here?
  }

  function submitProjectForm() {
    // Clickhandler logic for submit Button
  }

  return (
    <form className="new-project-form">
        <Input
            value={formValues.title}
            onChange
              ={event => setFormValue('title', event.target.value)}
            fullWidth
            margin="normal"
            placeholder="Your project name goes here.."  
            variant="standard"
            className="project-name-field"
            
        />
        <TextField
            value={formValues.description}
            onChange
              ={event => setFormValue('description', event.target.value)}
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
            formValues={formValues}
            quantity={questions.length}
            // Sample of passing setState function to child (so you can grab child form fields)
            setFormValue={setFormValue}
            deleteHandler={deleteQuestion}
          /> ))} 

        <AddQuestionButton clickHandler={addQuestion} />
        <SubmitFormButton clickHandler={submitProjectForm}/>
    </form>
  )
}
