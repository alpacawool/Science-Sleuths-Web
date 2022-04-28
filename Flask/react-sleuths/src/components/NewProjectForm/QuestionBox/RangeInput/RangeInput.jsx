import {useState} from 'react'

import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

import './RangeInput.scss'

export const RangeInput = (props) => {

  const [rangeCheck, setRangeCheck] = useState(false);

  const checkChangeHandler = (event) => {
    setRangeCheck(event.target.checked);
    props.disableRangeLimit(event.target.checked);

  }

  return (
    <Grid container
      spacing="1rem"
      paddingTop="0.5rem"
      className="range-input"
    >
      <Grid item xs={12} sm={1.5}>
        <FormControlLabel
          value={"Range Limit"}
          control={
            <Checkbox
            checked={rangeCheck}
            onChange={checkChangeHandler}
            size="large"
            sx = {{
              '&.Mui-checked': {
                color: "#009688",
              },
            }}
          />
          }
          label="Limit"
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <InputLabel id="min-label">Min</InputLabel>
          <TextField
            name="range_min"
            onChange={props.handleQuestionChange} 
            fullWidth 
            variant="outlined"
            disabled={!rangeCheck}
          />
      </Grid>
      <Grid item xs={12} sm={2}>
        <InputLabel id="max-label">Max</InputLabel>
          <TextField
            name="range_max"
            onChange={props.handleQuestionChange} 
            fullWidth 
            variant="outlined"
            disabled={!rangeCheck}
          />
      </Grid>
    </Grid>
  )
}
