import React from 'react'

import './SubmitFormButton.scss';

export const SubmitFormButton = (props) => {
  return (
    <div className="submit-form-button" onClick={props.clickHandler}>
      Submit
    </div>
  )
}
