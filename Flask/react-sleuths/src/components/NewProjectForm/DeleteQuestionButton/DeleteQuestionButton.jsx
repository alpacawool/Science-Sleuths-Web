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
