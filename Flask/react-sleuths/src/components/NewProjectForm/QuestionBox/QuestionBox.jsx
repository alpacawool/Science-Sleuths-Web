import {useState} from 'react'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DeleteQuestionButton } from '../DeleteQuestionButton/DeleteQuestionButton';


export const QuestionBox = (props) => {

  const [questionType, setQuestionType] = useState(0);

  const handleTypeChange = event => setQuestionType(event.target.value);

  function deleteHandler(id) {
    props.deleteHandler(id);
  }

  return (
    <Grid container
      spacing="1rem"
    >
        <Grid item xs={12} sm={1.2} md={1}>
          <DeleteQuestionButton
            deleteHandler={deleteHandler}
            id = {props.id}
          />
        </Grid>
        <Grid item xs={12} sm={7.8} md={8}>
            <InputLabel id="question-prompt-label">Question Prompt</InputLabel>
            <TextField 
                fullWidth 
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} sm={3}>
                <InputLabel id="select-question-type-label">Type</InputLabel>
                <Select fullWidth
                    labelId="select-queston-type-label"
                    id="question-type-select"
                    value={questionType}
                    label="Question Type"
                    onChange={handleTypeChange}
                    variant="outlined"
                >
                    <MenuItem value={0}>Yes or No</MenuItem>
                    <MenuItem value={1}>Whole Number</MenuItem>
                    <MenuItem value={2}>Decimal</MenuItem>
                    <MenuItem value={3}>Multiple Choice</MenuItem>
                    <MenuItem value={4}>Text</MenuItem>
                    <MenuItem value={4}>Date</MenuItem>
                </Select>
        </Grid>
    </Grid>
  )
}
