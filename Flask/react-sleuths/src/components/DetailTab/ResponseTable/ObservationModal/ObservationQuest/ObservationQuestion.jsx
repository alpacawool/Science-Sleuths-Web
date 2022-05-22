/**
 * ObservationQuestion.jsx
 * Display of a single observation question within the observation modal
 */

import React from 'react'
import {formatDate} from './../../../../../utilities/js/dateHelper.js'
import './ObservationQuestion.scss'

export const ObservationQuestion = (props) => {
  const types = ["True or False", "Whole Number", 
    "Decimal", "Multiple Choice", "Text", "Date"]

  return (
    <li className="observation-question-li">
        <span className="observation-question-index">
         Q{props.index+1}.
        </span>
        <span className="observation-question-type">
          {types[props.question.type]}
        </span>
        <span className="observation-question-prompt">
          {props.question.prompt} 
        </span>
        
        <div className="observation-response-div">
          {/* Multiple Choice */}
          {props.question.type === 3 &&
          <span className="observation-response-text">
            {props.question.choices[props.response.response]}
          </span>
          } 

          {/* Date */}
          {props.question.type === 5 &&
          <span className="observation-response-text">
            {formatDate(props.response.response)}
          </span>
          }

          {/* All other types */}
          {props.question.type !== 3 
          && props.question.type !== 5 &&
          <span className="observation-response-text">
            {String(props.response.response)}
          </span>
          }
        </div>
 
    </li>
  )
}
