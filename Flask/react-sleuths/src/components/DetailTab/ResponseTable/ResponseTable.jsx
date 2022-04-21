import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Title</TableCell>
              {props.questions.map((cell, index) =>
              <TableCell>
                Q{index+1}. {cell.prompt}
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
                {row.first_name} {row.last_name}
                </div>
                </TableCell>
                <TableCell
                 component="th" 
                 scope="row"
                 >
                  <div className="date-col">
                    {row.datetime}
                  </div>
                </TableCell>
         
                <TableCell>
                  <div className="title-col">
                    {row.title}
                  </div>
                </TableCell>
                  {/* Log individual responses */}
                  {row.responses.map((cell) =>
                  <TableCell>
                    {cell.type === 3 ?
                    // Check if multiple choice question (TYPE 3)
                    <span>
                    {props.questions[cell.question_num-1].choices[cell.response]}
                    </span>
                    : 
                    <span>{cell.response}</span>
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
