import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {formatDate} from './../../../utilities/js/dateHelper.js'
import './ResponseTable.scss'

export const ResponseTable = (props) => {

  return (
    <div className="response-table-container">
      <TableContainer
        component={Paper}
        sx = {{
          height: "60vh",
          width: '80vw',
          overflow: "auto",
        }}
      >
        <Table 
          stickyHeader
          aria-label="Project Detail Table"
          sx = {{
            width: "max-content",
            height: "max-content"
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Date and Time</TableCell>
              <TableCell align="left">Title</TableCell>
              {props.questions.map((cell, index) =>
              <TableCell>
                <span className="truncate-text">
                  Q{index+1}. {cell.prompt}
                </span>
              </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Log name and date */}
            {props.observations.map((row) => (

              <TableRow >
                <TableCell
                   sx={{
                    position: 'sticky',
                    left: 0,
                    background: 'white',
                   }}
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
                  {row.responses.map((cell) =>
                  <TableCell>
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
