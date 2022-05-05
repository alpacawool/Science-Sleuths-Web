import {useState} from 'react'

import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

import './RangeInput.scss'

export const RangeInput = (props) => {

  const [rangeCheck, setRangeCheck] = useState(false);
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const checkChangeHandler = (event) => {
    setRangeCheck(event.target.checked);
    props.disableRangeLimit(event.target.checked);
  }

  const minRangeHandler = (event) => {
    setMin(event.value)
    props.handleQuestionChange(event)
  }

  const maxRangeHandler = (event) => {
    setMax(event.value)
    props.handleQuestionChange(event)
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
            defaultValue={min}
            onChange={ (e) => {
              minRangeHandler(e);
            }}
            fullWidth 
            variant="outlined"
            disabled={!rangeCheck}
            error={!!props.error_message.range_min}
            helperText= {
              props.error_message.range_min
            }
            required
          />
      </Grid>
      <Grid item xs={12} sm={2}>
        <InputLabel id="max-label">Max</InputLabel>
          <TextField
            name="range_max"
            defaultValue={max}
            onChange={ (e) => {
              maxRangeHandler(e);
            }}
            fullWidth 
            variant="outlined"
            disabled={!rangeCheck}
            error={!!props.error_message.range_max}
            helperText= {
              props.error_message.range_max
            }
            required
          />
      </Grid>
    </Grid>
  )
}
