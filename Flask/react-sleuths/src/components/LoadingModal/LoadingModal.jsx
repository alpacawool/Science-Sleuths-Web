import React from 'react'
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';



import './LoadingModal.scss'

export const LoadingModal = (props) => {
  return (
    <Modal
        open={props.open}
        onClose={(_, reason) => {
            if (reason !== "backdropClick") {
                props.onClose();
            }
        }}
        className="loading-modal"
    >
        
        <div className="loading-modal-div">
            <CircularProgress 
                className="circular-progress-icon"
                color='primary'
                thickness={7.0}/>
            <br></br>
            <span className="loading-message">{props.message}</span>
        </div>
    </Modal>
  )
}
