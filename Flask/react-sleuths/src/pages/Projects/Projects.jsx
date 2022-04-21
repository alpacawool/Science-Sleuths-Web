/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import {useEffect, useState} from 'react'
import { ProjectTable } from '../../components/ProjectTable/ProjectTable'

const Projects = () => {

  const [projects, setProjects] = useState({})
  // Currently using placeholder user_id to view projects
  useEffect(() => {
    fetch("/users/Iw9BIoRWI4cVUb9BHTDI/projects")
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(data => setProjects(data))
      .then(error => console.log(error))
  }, [])

  return (
    <div>
      <h1>Projects</h1>
      <br></br>
      {projects.length > 0 ? 
        <ProjectTable projects={projects}/> 
        : 
        // Projects hasn't been loaded yet, do not load anything
        <p></p>
      }
    </div>
  )
}

export default Projects