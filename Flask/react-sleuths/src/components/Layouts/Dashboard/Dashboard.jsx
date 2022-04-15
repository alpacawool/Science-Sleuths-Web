/* 
    Dashboard serves as a wraparound for the main content of the internal site.
    Layout typically contains items such as the header, footer, sidebar
    and other items not typically seen in the main content.
*/
import {useState} from 'react';
import {Outlet} from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

import './Dashboard.scss'

export const Dashboard = ({children}) => {

  /*
    Drawer logic flow - Drawer will apply collapsed CSS classes
    to minimize drawer with the toggle onClick function.
  */
  const [openDrawer, setOpenDrawer] = useState(true);

  return (
    <div className="dashboard">

      <div className={`${openDrawer ? "" : "collapsed-header"} header`} >
        <div className="toggle-icon" onClick={() => setOpenDrawer(!openDrawer)}>
          {openDrawer ? <ChevronLeftIcon /> : <MenuIcon />}
        </div>
        <div className="title"></div>
      </div>

      <div className="container">
        <aside 
          className={`${openDrawer ? "" : "collapsed"} drawer`}
        >
          <div>
            <div className="mobile-close-icon" onClick={() => setOpenDrawer(!openDrawer)}>
              <CloseIcon />
            </div>

            <div className="logo">
              <ScienceIcon className="nav-icon"/>
              <span>Science Sleuths</span>
            </div>

            <ul className="nav">
              <li className="nav-item">
                <a href="/dash/projects" className="nav-item-link">
                  <CreditCardIcon className="nav-icon"/>
                  <span>Projects</span>
                </a>
              </li>

              <li className="nav-item">
                <a href="/dash/projects/new" className="nav-item-link">
                  <CreateNewFolderIcon className="nav-icon"/>
                  <span>New Project</span>
                </a>
              </li>

            </ul>
          </div>
          <div>
            <div className="welcome">
                <span>Hi, FIRST_NAME</span>
            </div>
            <a href="/" className="logout">
              <LogoutIcon className="nav-icon"/>
              <span>Log off</span>
            </a>
          </div>
        </aside>
       
        <div className={`${openDrawer ? "" : "collapsed-content"} content`} >
          {/* Render content in pages with react-router */}
          <Outlet />
        </div>
      </div>
    
    </div>
  )
}
