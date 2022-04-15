import React from 'react'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

export const MultipleChoice = () => {
  return (
    <Grid container
      spacing="1rem"
      paddingTop="0.5rem"
    >
      {/* TODO: Variable number of choices */}
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-1">Choice 1</InputLabel>
            <TextField 
                  fullWidth 
                  variant="outlined"
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-2">Choice 2</InputLabel>
            <TextField 
                  fullWidth 
                  variant="outlined"
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-3">Choice 3</InputLabel>
            <TextField 
                  fullWidth 
                  variant="outlined"
            />
      </Grid>
      <Grid item xs={12} sm={6}>
          <InputLabel id="choice-4">Choice 4</InputLabel>
            <TextField 
                  fullWidth 
                  variant="outlined"
            />
      </Grid>
    </Grid>
  )
}
