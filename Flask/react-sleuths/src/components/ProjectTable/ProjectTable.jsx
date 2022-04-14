/*
    Project Table for Projects Page
*/

import React from 'react'
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import './ProjectTable.scss'

export const ProjectTable = () => {

  // Test table data
  function createData(id, name, description) {
    return {id, name, description}
  }
  const rows = [
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
    createData(1, "Lorem ipsum dolor",
              `"Aliquam varius viverra ligula, nec dictum leo. 
              Vestibulum sodales faucibus lectus, condimentum finibus turpis.
              Fusce ultricies rhoncus pulvinar. Maecenas id laoreet eros.
              Morbi sapien felis, interdum a vestibulum eu, rhoncus dapibus sapien. 
              Phasellus facilisis at nisl dignissim ultrices. Proin non turpis fermentum, 
              elementum turpis at, tempus neque. Sed in dapibus purus. 
              Donec molestie nunc id consectetur efficitur."`),
  ];


  let navigate = useNavigate();
  
  function rowClickHandler(project_id) {
    console.log(project_id);
    navigate(`/projects/${project_id}`, {replace: true});
  }

  return (
    <TableContainer
      component={Paper}
      sx = {{
        height: "80vh",
        padding: "1em",
        overflow: "scroll",
      }}
    >
      <Table 
        aria-label="Projects Table"
        sx = {{
          height: "max-content",
          "& .MuiTableRow-root:hover": {
            backgroundColor: "#BEEAE6",
            cursor: "pointer"
          }
        }}
      >
        <TableHead>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow 
              key={row.id} 
              className="project-rows" 
              onClick={()=>rowClickHandler(row.id)}
            >
              <TableCell component="th" scope="row">
                <div className="name-col">
                  {row.name}
                </div>
              </TableCell>
              <TableCell className>
                <div className="description-col">
                  {row.description}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
