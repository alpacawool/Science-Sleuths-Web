import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from './pages/Projects/Projects';
import SingleProject from './pages/SingleProject/SingleProject';
import Login from './pages/Login/Login';
import NewProject from './pages/NewProject/NewProject';
import { Layout } from './components/Layout/Layout';


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
        <Layout>
          <Routes>
            {/* Home page - Show all projects 
                TODO: Show login page if NOT logged in*/}
            <Route path="/">
              <Route index element={<Projects />} />
            </Route>
            {/* Login page
                TODO: User Authentication handling */}
            <Route path="login" element={<Login />} />
            {/* Project URL handling */}
            <Route path="projects">
              <Route index element = {<Projects />} />
              <Route path =":projectid" element={<SingleProject />} />
              <Route path="new" element={<NewProject />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
