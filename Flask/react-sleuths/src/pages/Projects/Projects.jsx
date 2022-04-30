/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState } from "react";
import { auth } from "../../utilities/js/firebase";
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { onAuthStateChanged } from "firebase/auth";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  // this flag is needed in order to prevent the fetch request from firing twice
  let authFlag = true;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && authFlag) {
        authFlag = false;
        fetch(`/users/${user.uid}/projects`, { method: "POST" })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setProjects(data);
          })
          .catch((err) => {
            const errCode = err.code;
            const errMessage = err.message;
            console.log(errCode, errMessage);
          });
      }
    });
  }, [])

  return (
    <div>
      <h1>Projects</h1>
      <br></br>
      {projects.length > 0 ? (
        <ProjectTable projects={projects} />
      ) : (
        <p>You do not have any projects.</p>
      )}
    </div>
  );
};

export default Projects;
