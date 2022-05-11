/**
 * SingleProject.jsx
 * Individual Project page that shows a single project from a single user
 * Displays a tabbed menu to switch between a table view and summary  view
 * Makes asynchronous calls to retrieve project summary and observations
 */

import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { DetailTab } from "../../components/DetailTab/DetailTab";

import "./SingleProject.scss";
import { useFetchHook } from "../../utilities/js/fetchPostHelper";

const SingleProject = () => {
  const { project_id } = useParams();

  const [{ projData, projIsLoading, projIsError }] = useFetchHook(`/projects/${project_id}`, { method: "POST" }, "projIsLoading", "projIsError", "projData");
  const [{ obsData, obsIsLoading, obsIsError }] = useFetchHook(`/projects/${project_id}/observations`, { method: "POST" }, "obsIsLoading", "obsIsError", "obsData");

  return (
    <div>
      {projIsError && <p>Error loading project...</p>}
      {obsIsError && <p>Error loading observations...</p>}
      {projIsLoading && <p>Loading project...</p>}
      {projData ? (
        <Grid container spacing="1rem" className="single-project-container">
          <Grid item xs={12} sm={6}>
            <h1>{projData.title}</h1>
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
            <p className="description-paragraph">{projData.description}</p>
          </Grid>

          <Grid item xs={12} sm={6}>
            <button className="download-csv-button">
              <DownloadIcon className="download-csv-icon" />
              {/* TODO: Add CSV download functionality */}
              Export .csv
            </button>
          </Grid>
          <Grid item xs={12}>
            {obsIsLoading && <p>Loading observations...</p>}
            {(obsData && obsData.length > 0) ? (
              <DetailTab
                questions={projData.questions}
                observations={obsData}
              />
            ) : (
              <p>There are no observations yet.</p>
            )}
          </Grid>
        </Grid>
      ) : (<></>)}
    </div>
  );
};

export default SingleProject;
