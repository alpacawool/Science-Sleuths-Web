/*
    Project Table for Projects Page
*/

import React, {useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import './ProjectTable.scss'

export const ProjectTable = (props) => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const user_id = location.state.user_id;
  const display_name = location.state.display_name;

  let navigate = useNavigate();
  
  function rowClickHandler(project_id) {
    navigate(`/dash/projects/${project_id}`, {replace: true, state: location.state});
  }

  return (
    <div 
    className={`${props.openDrawer ? "" : "collapsed-projects-list-container"} 
    projects-list-container`}
    >
      <TableContainer
        component={Paper}
      >
        <Table 
          aria-label="Projects Table"
          sx = {{
            height: "max-content",
            "& .MuiTableRow-root:hover": {
              backgroundColor: "#fcf7f7",
              cursor: "pointer"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.projects.map((row) => (
              <TableRow 
                key={row.project_id} 
                className="project-rows" 
                onClick={()=>rowClickHandler(row.project_id)}
              >
                <TableCell component="th" scope="row">
                  <div className="name-col">
                    {row.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="description-col">
                    {row.description}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
