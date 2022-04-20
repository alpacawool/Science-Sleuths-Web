import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const ResponseTable = (props) => {
  return (
    
      <TableContainer
      component={Paper}
      sx = {{
        overflow: "scroll",
      }}
    >
      <Table aria-label="Project Detail Table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            {props.questions.map((cell) =>
            <TableCell>
              {cell.prompt}
            </TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Log name and date */}
          {props.observations.map((row) => (
            <TableRow >
              <TableCell component="th" scope="row">
                <div className="date-col">
                  {row.datetime}
                </div>
              </TableCell>
              <TableCell>
                <div className="name-col">
                  {row.first_name} {row.last_name}
                </div>
              </TableCell>
                {/* Log individual responses */}
                {row.responses.map((cell) =>
                <TableCell>
                  {cell.response}
                </TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
