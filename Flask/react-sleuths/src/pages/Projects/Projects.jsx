/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utilities/js/firebase";
import { ProjectTable } from '../../components/ProjectTable/ProjectTable';

const Projects = () => {

  const [projects, setProjects] = useState({});
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetch("/users/" + user.uid + "/projects")
        .then(response => {
          if (response.status === 200) {
            return response.json()
          }
        })
        .then(data => setProjects(data))
        .then(error => console.log(error))
    }
  }, [user]);

  return (
    <div>
      <h1>Projects</h1>
      <br></br>
      {projects.length > 0 ? 
        <ProjectTable projects={projects}/> 
        : 
        
        <p>You do not have any projects.</p>
      }
    </div>
  )
}

export default Projects