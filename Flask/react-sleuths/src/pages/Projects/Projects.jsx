/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { LoadingModal } from "../../components/LoadingModal/LoadingModal";
import { useFetchHook } from "../../utilities/js/fetchPostHelper";

import './Projects.scss'

const Projects = (props) => {

  let navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const user_id = location.state.user_id;
  const display_name = location.state.display_name;
  
  let count = useRef(0);

  const [{ data, isLoading, isError }] = useFetchHook(`/users/${user_id}/projects`, { method: "POST" });

  const showLoadingModal = () => {
    setLoading(true);
  };

  const hideLoadingModal = () => {
    setLoading(false);
  }

  const onNewRandomButtonClick = () => {
    // Show loading indicator
    showLoadingModal();

    fetch('/create-sample-project')
    .then(response => {
      if (response.status === 200) {
         return response.json();
      } else {
        throw new Error();
      }
    })
    .then(data => {
      navigate(`/dash/projects/${data.project_id}`, {replace: true, state: location.state});
      hideLoadingModal()
    })
    .catch(error => {
      console.log(error)
      hideLoadingModal()
    })
  }

  return (
    <div>
      <LoadingModal
        open={loading}
        onClose={hideLoadingModal} 
        message="Generating random project"
      />
      <h1>Projects</h1>
      <button 
        onClick={onNewRandomButtonClick}
        className="random-project-button">
          <ShuffleIcon className="random-shuffle-icon"/>
        Create a random project
      </button>
      <br></br>
      {isError && <p>Something went wrong...</p>}
      {isLoading && <p>Loading...</p>}
      {data && data.length == 0 && <p>You don't have any projects yet.</p>}
      {data && <ProjectTable projects={data} {...props}/>}
    </div>
  );
};

export default Projects;
