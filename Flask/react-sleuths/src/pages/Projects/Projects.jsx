/**
 * Projects.jsx
 * Displays list of projects for current user
 */
import { ProjectTable } from "../../components/ProjectTable/ProjectTable";
import { useLocation } from "react-router-dom";
import { useFetchHook } from "../../utilities/js/fetchPostHelper";

const Projects = () => {
  const location = useLocation();
  let user_id = location.state.user_id;

  const [{ data, isLoading, isError }] = useFetchHook(`/users/${user_id}/projects`, { method: "POST" });

  return (
    <div>
      <h1>Projects</h1>
      <br></br>
      {isError && <p>Something went wrong...</p>}
      {isLoading && <p>Loading...</p>}
      {(!data || data.length === 0) && !isLoading && <p>You don't have any projects.</p>}
      {data && <ProjectTable projects={data} />}
    </div>
  );
};

export default Projects;
