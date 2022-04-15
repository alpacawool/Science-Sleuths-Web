import React from 'react'

import './SubmitFormButton.scss';

export const SubmitFormButton = (props) => {
  return (
    <button 
      className="submit-form-button" 
      type="submit" 
      onClick={props.clickHandler}>
      Submit
    </button>
  )
}
