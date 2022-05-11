import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from './pages/Projects/Projects';
import SingleProject from './pages/SingleProject/SingleProject';
import Login from './pages/Login/Login';
import { Signup } from './pages/Signup/Signup';
import NewProject from './pages/NewProject/NewProject';
import { Dashboard } from './components/Layouts/Dashboard/Dashboard';
import { ExternalView } from './components/Layouts/ExternalView/ExternalView';


function App() {

  const [openDrawer, setOpenDrawer] = useState(true);;
  const updateDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <div className="App">
      {/* Frontend Routes using react-router */}
      {/* TODO: User authentication and only view certain pages if signed in.. */}
     <BrowserRouter>
      <Routes>
        {/* External */}
        <Route path="/" element={<ExternalView />} >
        <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        {/* Internal */}
        <Route path="/dash" 
          element={<Dashboard 
            openDrawer={openDrawer}
            updateDrawer={updateDrawer}
          />}>
          <Route path="/dash" element={<Projects />} />
          <Route path="/dash/projects" 
            element={<Projects />} 
            openDrawer={openDrawer}
          />
          <Route path="/dash/projects/:project_id" 
            element={<SingleProject 
            openDrawer={openDrawer} 
            />} />
          <Route path="/dash/projects/new" element={<NewProject />} />
        </Route>
      </Routes>
     
     </BrowserRouter>
    </div>
  );
}

export default App;
