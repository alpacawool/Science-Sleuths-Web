/**
 * AddQuestionButton.jsx
 * Modified div with onClick behavior intended for adding question
 * to a new project with the form.
 */
import React from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import './AddQuestionButton.scss';

export const AddQuestionButton = (props) => {
  return (
    <div className="add-question-button" onClick={props.clickHandler}>
        <AddCircleIcon className="add-icon"/> Add Question
    </div>
  )
}
