/**
 * SingleProject.jsx
 * Individual Project page that shows a single project from a single user
 * Displays a tabbed menu to switch between a table view and summary  view
 * Makes asynchronous calls to retrieve project summary and observations
 */

import { useEffect, useState, useRef } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Grid } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { DetailTab } from "../../components/DetailTab/DetailTab";
import { LoadingModal } from "../../components/LoadingModal/LoadingModal";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";

import "./SingleProject.scss";
import { useFetchHook } from "../../utilities/js/fetchPostHelper";

const SingleProject = (props) => {
  const { project_id } = useParams();
  const location = useLocation();
  let navigate = useNavigate();
  let user_id = location.state.user_id;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [{ projData, projIsLoading, projIsError }] = useFetchHook(
    `/projects/${project_id}`,
    { method: "POST" },
    "projIsLoading",
    "projIsError",
    "projData"
  );
  const [{ obsData, obsIsLoading, obsIsError }] = useFetchHook(
    `/projects/${project_id}/observations`,
    { method: "POST" },
    "obsIsLoading",
    "obsIsError",
    "obsData"
  );

  useEffect(() => {
    if (window.innerWidth <= 450) {
      console.log(props.openDrawer);
      props.closeDrawer();
    }
  }, []);

  const onClickDownload = () => {
    if (user_id) {
      fetch(`/projects/${project_id}/download`, { method: "GET" })
        .then((response) => {
          if (response.status === 200) {
            let data = response.body.getReader();
            data.read().then(({ done, value }) => {
              saveCSV(
                new TextDecoder("utf-8").decode(value),
                `${project_id}.csv`
              );
            });
          } else {
            throw new Error("Error downloading data.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteProject = () => {
    setDeleteLoading(true);
    fetch(`/projects/${project_id}/delete`, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          navigate(`/dash/projects/`, { replace: true, state: location.state });
          setDeleteLoading(false);
        } else {
          throw new Error("Error deleting project.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveCSV = (data, fileName) => {
    /**
     * Download .csv file
     * Credits to fryeguy @ https://stackoverflow.com/questions/31214677/
     * **/
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create DOM element and force click to download object
    const downloadElement = document.createElement("a");
    downloadElement.href = url;
    downloadElement.download = fileName;
    downloadElement.click();
  };

  return (
    <div>
      {projIsError && <p>Error loading project...</p>}
      {obsIsError && <p>Error loading observations...</p>}
      {projIsLoading && <p>Loading project...</p>}
      <LoadingModal
        open={deleteLoading}
        onClose={() => setDeleteLoading(false)}
        message="Deleting project..."
      />
      <ConfirmDialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        handleYes={() => { setDeleteConfirm(false); deleteProject(); }}
      />
      {projData ? (
        <Grid container spacing="1rem" className="single-project-container">
          <Grid item xs={12} sm={6}>
            <h1>{projData.title}</h1>
            <button className="delete-project-button" onClick={() => setDeleteConfirm(true)}>
              Delete Project
            </button>
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
            <button
              // Only allow button to be clickable if user_id
              // is loaded, otherwise, show greyed out button
              disabled={!user_id}
              className={
                user_id
                  ? "download-csv-button download-available"
                  : "download-csv-button download-unavailable"
              }
              onClick={onClickDownload}
            >
              <DownloadIcon className="download-csv-icon" />
              Export .csv
            </button>
          </Grid>
          <Grid item xs={12}>
            {obsIsLoading && <p>Loading observations...</p>}
            {obsData && obsData.length > 0 ? (
              <DetailTab
                questions={projData.questions}
                observations={obsData}
                {...props}
              />
            ) : (
              <p>There are no observations yet.</p>
            )}
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SingleProject;
