import {useState} from 'react'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DeleteQuestionButton } from '../DeleteQuestionButton/DeleteQuestionButton';

import { RangeInput } from './RangeInput/RangeInput';
import { MultipleChoice } from './MultipleChoice/MultipleChoice';

import './QuestionBox.scss'


export const QuestionBox = (props) => {

  const [projQuestion, setProjQuestion] = useState({
    prompt: "",
    question_num: 1,
    type:0,
    range_min: null,
    range_max: null,
    choices: [] 
  })

  const handleQuestionChange = e => {
    const { name, value } = e.target;

    setProjQuestion(prevProjQuestion => ({
        ...prevProjQuestion,
        [name]: value
    }));
    props.updateQuestionList(props.index, projQuestion)
  };


  const updateMultipleChoice = index => event => {
    const { name, value } = event.target;
    let newChoices = [...projQuestion.choices];
    newChoices[index] = value;

    setProjQuestion(prevProjQuestion => ({
      ...prevProjQuestion,
      [name]: newChoices
  }));
    props.updateQuestionList(props.index, projQuestion)
  }

  const disableRangeLimit = checked => {
    if (checked == 0) {
      setProjQuestion(prevProjQuestion => ({
        ...prevProjQuestion,
        ['range_min']: null,
        ['range_max']: null,
      }))
    }
    props.updateQuestionList(props.index, projQuestion)
  }

  const [questionType, setQuestionType] = useState(0);

  const handleTypeChange = (event) => {
    setQuestionType(event.target.value);
    // Update question type in state
    handleQuestionChange(event)
  }

  function deleteHandler(id) {
    props.deleteHandler(id, props.index);
    console.log(props)
  }


  return (
    <div className="question-box">
      <Grid container
        spacing="1rem"
        marginTop="0.005rem"
      >
     
          <Grid item xs={12} sm={7.8} md={8}>
              <InputLabel id="question-prompt-label">Question Prompt {props.index+1}</InputLabel>
              <TextField
                  value={projQuestion.prompt}
                  name="prompt"
                  onChange={handleQuestionChange}
                  fullWidth 
                  variant="outlined"
                  multiline={true}
              />
          </Grid>
          <Grid item xs={12} sm={3}>
                  <InputLabel id="select-question-type-label">Type</InputLabel>
                  <Select fullWidth
                      name="type"
                      labelId="select-queston-type-label"
                      id="question-type-select"
                      value={questionType}
                      label="Question Type"
                      onChange={handleTypeChange}
                      variant="outlined"
                  >
                      <MenuItem value={0}>True or False</MenuItem>
                      <MenuItem value={1}>Whole Number</MenuItem>
                      <MenuItem value={2}>Decimal</MenuItem>
                      <MenuItem value={3}>Multiple Choice</MenuItem>
                      <MenuItem value={4}>Text</MenuItem>
                      <MenuItem value={5}>Date</MenuItem>
                  </Select>
          </Grid>
          <Grid item xs={12} sm={1.2} md={1}>
            {/* Do not show delete button if only one question */}
            { props.quantity > 1 ?
                <DeleteQuestionButton
                deleteHandler={deleteHandler}
                id = {props.id}
                />
                :null
            }
          </Grid>
      </Grid>
      {/* Show additional Grid input fields based on Question Type */}
      {/* Numeric Type - Decimal or Whole Number */}
      { questionType === 1 || questionType === 2 ?
       <RangeInput
        handleQuestionChange={handleQuestionChange}
        disableRangeLimit={disableRangeLimit}
       /> 
       : null}
       {/* Numeric Type - Multiple Choice */}
       { questionType === 3 ? 
       <MultipleChoice 
        updateMultipleChoice={updateMultipleChoice}
        /> 
       : null}
    </div>
  )
}
