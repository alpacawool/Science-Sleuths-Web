/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState } from "react";
import { auth, authUser } from "../../utilities/js/firebase";
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { useNavigate, useLocation } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const user_id = location.state.user_id;
  const display_name = location.state.display_name;
  // triggers once when a user's state is no longer null
  useEffect(() => {
    if (user_id) {
      fetch(`/users/${user_id}/projects`, { method: "POST" })
      .then((response) => {
        return response.json();
      })
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
    } else {
      setMessage("Unauthorized.");
    }
  }, []);

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
