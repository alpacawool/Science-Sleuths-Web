/**
 * ResponseTable.jsx
 * Displays list of observations for a single project
 */

import React, {useState} from 'react';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {formatDate} from './../../../utilities/js/dateHelper.js'
import { ObservationModal } from './ObservationModal/ObservationModal.jsx';
import './ResponseTable.scss'


export const ResponseTable = (props) => {
  
  const [observation, setObservation] = useState({
    first_name: '',
    last_name: '',
    date: '',
    title: '',
    responses: [],
  });

  const [open, setOpen] = useState(false);
  const openObservation = (
    firstName, 
    lastName,
    date,
    title,
    responses
  ) => {
    // Set current observation
    setObservation(prevObservation => ({
      ...prevObservation,
      ['first_name']: firstName,
      ['last_name']: lastName,
      ['date']: date,
      ['title']: title,
      ['responses']: responses,
    }));
    setOpen(true);
  }
  const closeObservation = () => setOpen(false);


  return (
    <div className="response-table-container">
      <ObservationModal
      open={open} 
      close={closeObservation}
      observation={observation}
      questions={props.questions}
      />
      <TableContainer
        component={Paper}
      >
        <Table 
          stickyHeader
          aria-label="Project Detail Table"
          sx = {{
            width: "max-content",
            height: "max-content",
            "& .MuiTableRow-root:hover": {
              backgroundColor: "#fcf7f7",
              cursor: "pointer"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Date and Time</TableCell>
              <TableCell align="left">Title</TableCell>
              {props.questions.map((cell, index) =>
              <TableCell key={index}>
                <span className="truncate-text">
                  Q{index+1}. {cell.prompt}
                </span>
              </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Log name and date */}
            {props.observations.map((row, index) => (

              <TableRow 
                key={index}
                onClick={()=>
                  openObservation(
                    row.first_name,
                    row.last_name,
                    formatDate(row.datetime),
                    row.title,
                    row.responses
                  )}>
                <TableCell
                  className="name-cell"
                   >
                <div className="name-col">
                  <span className='truncate-text'>
                    {row.first_name} {row.last_name}
                  </span>
                </div>
                </TableCell>
                <TableCell
                 component="th" 
                 scope="row"
                 >
                  <div className="date-col">
                    {formatDate(row.datetime)}
                  </div>
                </TableCell>
         
                <TableCell>
                  <div className="title-col">
                    <span className='truncate-text'>
                    {row.title}
                    </span>
                  </div>
                </TableCell>
                  {/* Log individual responses */}
                  {row.responses.map((cell, index) =>
                    <TableCell key={index}>
                    {cell.type === 3 ?
                    // Check if multiple choice question (TYPE 3)
                    <span className='truncate-text'>
                    {props.questions[cell.question_num-1].choices[cell.response]}
                    </span>
                    : 
                      null
                    }

                    {cell.type === 5 ?
                    // Check if cell is date and format (TYPE 5)
                    <span className='truncate-text'>
                      {formatDate(cell.response)}
                    </span>
                    : 
                      null
                    }

                    {cell.type !== 3 && cell.type !== 5 ?
                    // All other cells
                    <span className='truncate-text'>
                      {cell.response}
                    </span>
                    : 
                      null
                    }   
                    
                  </TableCell>
                  )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
    </div>
  )
}
