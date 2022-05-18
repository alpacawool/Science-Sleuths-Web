import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "./ObservationModal.scss";
import { ObservationQuestion } from "./ObservationQuest/ObservationQuestion";

export const ObservationModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      className={`${props.openDrawer ? "" : "collapsed-modal"} 
          observation-modal`}
      sx={{
        "&:focus": {
          outline: "none",
        },
      }}
    >
      <div className="observation-modal-container">
        {props.observation.responses.length > 0 ? (
          <div className="observation-modal-div">
            <button onClick={props.close} className="close-observation-button">
              <ArrowBackIcon className="close-observation-arrow" />
              Back to Project
            </button>
            <h1>{props.observation.title}</h1>
            <ul>
              <li>
                <span className="observation-label-text">Submitted by:</span>
                <span className="observation-field-text">
                  {props.observation.first_name} {props.observation.last_name}
                </span>
              </li>
              <li>
                <span className="observation-label-text">Time:</span>
                <span className="observation-field-text">
                  {props.observation.date}
                </span>
              </li>
              {props.observation.image_url && (
                <li>
                  <span className="observation-label-text">
                    Image Thumbnail:
                  </span>
                  <a href={props.observation.image_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={props.observation.image_url}
                      alt="Observation Image"
                      height="100"
                      width="100"
                    />
                  </a>
                </li>
              )}
              <li>
                <span className="observation-label-text">
                  {props.openDrawer}
                </span>
                <span className="observation-field-text"></span>
              </li>

              {props.questions.map((listItem, index) => (
                <ObservationQuestion
                  key={index}
                  index={index}
                  response={props.observation.responses[index]}
                  question={listItem}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </Modal>
  );
};
