import React from 'react'
import Modal from '@mui/material/Modal';

import './ObservationModal.scss'

export const ObservationModal = (props) => {
  return (
    <Modal
        open = {props.open}
        onClose =  {props.close}
        className="observation-modal"
    >
        {props.observation.responses.length > 0 ? (
            <div className='observation-modal-div'>
                <h1>{props.observation.title}</h1>
                <ul>
                <li>
                    <span className="observation-label-text">
                        Submitted by: 
                    </span>
                    <span className="observation-field-text">
                        {props.observation.first_name} {props.observation.last_name}
                    </span>
                </li>
                <li>
                    <span className="observation-label-text">
                        Time:  
                    </span>
                    <span className="observation-field-text">
                        {props.observation.date}
                    </span>
                </li>
                {props.questions.map((listItem, index) =>
                <li key={index}>
                    <span className="observation-question-prompt">
                    Q{index+1}. [True or False] {listItem.prompt} 
                    </span>
                </li>)}
                </ul>
     
            </div>
        ) : (
        <p></p>
        )}
    </Modal>
  )
}
