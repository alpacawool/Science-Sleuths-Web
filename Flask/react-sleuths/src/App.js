import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllProjects from './pages/AllProjects/AllProjects';
import SingleProject from './pages/SingleProject/SingleProject';
import Login from './pages/Login/Login';
import NewProject from './pages/NewProject/NewProject';


function App() {

  const [state, setState] = useState({})

  // Example of using useEffect to get JSON data from Flask
  useEffect(() => {
    fetch("/hello").then(response => {
      if (response.status === 200) {
        return response.json()
      }
    }).then(data => setState(data))
    .then(error => console.log(error))
  }, [])

  return (
    <div className="App">
      {/* Frontend Routes using react-router */}
      <BrowserRouter>
        <Routes>
          {/* Home page - Show all projects 
              TODO: Show login page if NOT logged in*/}
          <Route path="/">
            <Route index element={<AllProjects />} />
          </Route>
          {/* Login page
              TODO: User Authentication handling */}
          <Route path="login" element={<Login />} />
          {/* Project URL handling */}
          <Route path="projects">
            <Route index element = {<AllProjects />} />
            <Route path =":projectid" element={<SingleProject />} />
            <Route path="new" element={<NewProject />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
