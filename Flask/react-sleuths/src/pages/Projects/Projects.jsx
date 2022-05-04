/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState, useRef } from "react";
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { useLocation } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  let user_id = location.state.user_id;
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

  return (
    <div>
      <h1>Projects</h1>
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
