/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState, useRef } from "react";
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { useLocation, useNavigate } from "react-router-dom";

const Projects = () => {

  let navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const user_id = location.state.user_id;
  const display_name = location.state.display_name;
  
  let count = useRef(0);

  useEffect(() => {
    count.current += 1;
  });
  
  useEffect(() => {
    if (user_id && count.current < 2) {
      fetch(`/users/${user_id}/projects`, { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
          if (projects.length === 0) {
            setMessage("You do not have any projects.");
          }
        })
        .catch((err) => {
          setMessage("Unauthorized.");
          console.log(err);
        });
    }
  }, [projects.length, user_id]);

  const onNewRandomButtonClick = () => {
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
    })
    .catch(error => console.log(error))
  }

  return (
    <div>
      <h1>Projects</h1>
      <button onClick={onNewRandomButtonClick}>
        Create a random project
      </button>
      <br></br>
      {projects.length > 0 ? (
        <ProjectTable projects={projects} />
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default Projects;
