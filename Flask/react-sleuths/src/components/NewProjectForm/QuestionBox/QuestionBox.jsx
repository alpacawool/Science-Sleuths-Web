/**
 * QuestionBox.jsx
 * The overall field for an individual questions within the new project form
 * Has conditionals that based on question type may show more fields in addition
 * to the question prompt. For example, multiple choice questions will display
 * additional fields to define the choices. If there is more than one question,
 * a delete button is displayed to allow questions to be deleted.
 */
import {useState, useEffect} from 'react'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DeleteQuestionButton } from '../DeleteQuestionButton/DeleteQuestionButton';

import { RangeInput } from './RangeInput/RangeInput';
import { MultipleChoice } from './MultipleChoice/MultipleChoice';

import { 
  projectFormValidator,
  multipleChoiceFormValidator
} from './../../../utilities/js/inputValid.js'

import './QuestionBox.scss'


export const QuestionBox = (props) => {

  const [projQuestion, setProjQuestion] = useState({
    prompt: "",
    question_num: props.index+1,
    type:0,
    set_range: false,
    range_min: null,
    range_max: null,
    choices: [],
    error_message: {}
  })

  // Update newProject state question list
  useEffect(() => {
    props.updateQuestionList(props.index, projQuestion)
  }, [projQuestion])

  const handleQuestionChange = e => {
    const { name, value } = e.target;

    // For range type
    var opposingValue = null
    if (name === 'range_min') {
      opposingValue = projQuestion.range_max;
    }
    if (name === 'range_max') {
      opposingValue = projQuestion.range_min;
    }
  
    // Check if change of type (reset error fields)
    if (name === 'type') {
      setProjQuestion(prevProjQuestion => ({
        ...prevProjQuestion,
        [name]: value,
        ['error_message']: {}
      }));
    } else {
      setProjQuestion(prevProjQuestion => ({
          ...prevProjQuestion,
          [name]: value,
          ['error_message']: {...prevProjQuestion.error_message,
            [name]: projectFormValidator(name, value, opposingValue)
          }
      }));
    }

  };

  const updateMultipleChoice = index => event => {
    const { name, value } = event.target;
    let newChoices = [...projQuestion.choices];
    newChoices[index] = value;

    setProjQuestion(prevProjQuestion => ({
      ...prevProjQuestion,
      [name]: newChoices,
      ['error_message']: {...prevProjQuestion.error_message,
        [`choice${index}`]: multipleChoiceFormValidator(value, index)
      }
    }));
  }

  const disableRangeLimit = (checked) => {
    if (checked === false) {
      setProjQuestion(prevProjQuestion => ({
        ...prevProjQuestion,
        ['set_range']: false,
        ['range_min']: null,
        ['range_max']: null,
        ['error_message']: {...prevProjQuestion.error_message, 
          ['range_min']: '',
          ['range_max']: ''
        }

      }))
    } else {
      setProjQuestion(prevProjQuestion => ({
        ...prevProjQuestion,
        ['set_range']: true,
        ['range_min']: '',
        ['range_max']: '',
      }))
    }
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
                  error={!!projQuestion.error_message.prompt}
                  helperText= {
                    projQuestion.error_message.prompt
                  }
                  required
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
        error_message = {projQuestion.error_message}
       /> 
       : null}
       {/* Numeric Type - Multiple Choice */}
       { questionType === 3 ? 
       <MultipleChoice 
        updateMultipleChoice={updateMultipleChoice}
        error_message = {projQuestion.error_message}
        /> 
       : null}
    </div>
  )
}
