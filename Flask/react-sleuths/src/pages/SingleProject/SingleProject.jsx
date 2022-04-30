/**
 * SingleProject.jsx
 * Individual Project page that shows a single project from a single user
 * Displays a tabbed menu to switch between a table view and summary  view
 * Makes asynchronous calls to retrieve project summary and observations
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { DetailTab } from "../../components/DetailTab/DetailTab";
import { auth } from "../../utilities/js/firebase";
import { onAuthStateChanged } from "firebase/auth";

import "./SingleProject.scss";

const SingleProject = () => {
  const { project_id } = useParams();
  const [project, setProject] = useState({});
  const [observations, setObservations] = useState({});
  // this flag is needed in order to prevent the fetch request from firing twice
  let authFlag = true;

  // get project data
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && authFlag) {
        authFlag = false;
        fetch(`/projects/${project_id}`, { method: "POST" })
          .then((response) => response.json())
          .then((data) => setProject(data))
          .then(() => fetch(`/projects/${project_id}/observations`, { method: "POST" }))
          .then((response) => response.json())
          .then((data) => setObservations(data))
          .catch((err) => {
            const errCode = err.code;
            const errMessage = err.message;
            console.log(errCode, errMessage);
          });
      }
    })
  }, []);


  return (
    <div>
      {project !== {} ? (
        <Grid container spacing="1rem" className="single-project-container">
          <Grid item xs={12} sm={6}>
            <h1>{project.title}</h1>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div className="project-code-container">
              <span className="project-code-title">Code</span>
              <div className="project-code-string">
                <ContentCopyIcon className="project-code-icon" />
                {project_id}
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} className="description-container">
            <span className="description-paragraph-title">Description</span>
            <p className="description-paragraph">{project.description}</p>
          </Grid>

          <Grid item xs={12} sm={6}>
            <button className="download-csv-button">
              <DownloadIcon className="download-csv-icon" />
              {/* TODO: Add CSV download functionality */}
              Export .csv
            </button>
          </Grid>
          <Grid item xs={12}>
            {/* If there are observations for the current project,
            render the table and summary tabs. */}
            {observations.length > 0 ? (
              <DetailTab
                questions={project.questions}
                observations={observations}
              />
            ) : (
              <p>There are no observations yet.</p>
            )}
          </Grid>
        </Grid>
      ) : (
        // Project hasn't been defined yet, do not render data
        <p></p>
      )}
    </div>
  );
};

export default SingleProject;
