/**
 * MultipleChoice.jsx
 * Handles the multiple choice question type in the new project form
 * Currently set up to statically handle four defined choices
 */
import React from 'react'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

export const MultipleChoice = (props) => {

  return (
    <Grid container
      spacing="1rem"
      paddingTop="0.5rem"
    >
      {/* TODO: Variable number of choices */}
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-1">Choice 1</InputLabel>
            <TextField
                  name="choices"
                  onChange={props.updateMultipleChoice(0)} 
                  fullWidth 
                  variant="outlined"
                  error={!!props.error_message.choice0}
                  helperText= {
                    props.error_message.choice0
                  }
                  required
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-2">Choice 2</InputLabel>
            <TextField
                  name="choices"
                  onChange={props.updateMultipleChoice(1)}  
                  fullWidth 
                  variant="outlined"
                  error={!!props.error_message.choice1}
                  helperText= {
                    props.error_message.choice1
                  }
                  required
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-3">Choice 3</InputLabel>
            <TextField
                  name="choices"
                  onChange={props.updateMultipleChoice(2)}  
                  fullWidth 
                  variant="outlined"
                  error={!!props.error_message.choice2}
                  helperText= {
                    props.error_message.choice2
                  }
                  required
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-4">Choice 4</InputLabel>
            <TextField
                  name="choices"
                  onChange={props.updateMultipleChoice(3)}  
                  fullWidth 
                  variant="outlined"
                  error={!!props.error_message.choice3}
                  helperText= {
                    props.error_message.choice3
                  }
                  required
            />
      </Grid>
    </Grid>
  )
}
