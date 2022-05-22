/**
 * SubmitFormButton.jsx
 * A button with onClick behavior to create a new project
 */
import React from 'react'

import './SubmitFormButton.scss';

export const SubmitFormButton = (props) => {
  return (
    <button 
      className="submit-form-button"
      type="button"
      onClick={props.clickHandler}>
      Submit
    </button>
  )
}
