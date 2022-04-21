/**
 * NewProject.jsx
 * Represents form for creating a new project for a single user
 */
import { NewProjectForm } from '../../components/NewProjectForm/NewProjectForm'

const NewProject = () => {
  return (
    <div>
      <h1>New Project</h1>
      <br></br>
      <NewProjectForm />
    </div>
  )
}

export default NewProject