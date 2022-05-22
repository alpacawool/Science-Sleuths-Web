/**
 * DeleteQuestionButton.jsx
 * Modified div with onClick behavior designed to delete custom questions
 * from the new project form. To prevent events from cascading throughout
 * the child components (ie., some events were firing more than once) 
 * stopPropagation was added to the event handler
 */

import React from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import './DeleteQuestionButton.scss';

export const DeleteQuestionButton = (props) => {

  return (
    <div 
      className="delete-question-button" 
      onClick= {(e)=> {
        e.stopPropagation(); 
        props.deleteHandler(props.id);
  
      }}
    >
        <HighlightOffIcon className="delete-icon"/>
        <span>Delete</span>
    </div>
  )
}
