/* 
    Layout serves as a wraparound for the main content of the site.
    Layout typically contains items such as the header, footer, sidebar
    and other items not typically seen in the main content. 
*/
import {useState} from 'react'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

import './Layout.scss'

export const Layout = ({children}) => {

  const [openDrawer, setOpenDrawer] = useState(true);

  return (
    <div className="layout">

      <div className={`${openDrawer ? "" : "collapsed-header"} header`} >
        <div className="toggle-icon" onClick={() => setOpenDrawer(!openDrawer)}>
          {openDrawer ? <ChevronLeftIcon /> : <MenuIcon />}
        </div>
        <div className="title">Header</div>
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
              <ScienceIcon/>
              <span>ScienceSleuths</span>
            </div>

            <ul className="nav">
              <li className="nav-item">
                <a href="/projects" className="nav-item-link">
                  <CreditCardIcon />
                  <span>Projects</span>
                </a>
              </li>

              <li className="nav-item">
                <a href="/projects/new" className="nav-item-link">
                  <CreateNewFolderIcon />
                  <span>New Project</span>
                </a>
              </li>
            </ul>
          </div>
          <a href="#" className="logout">
            <LogoutIcon />
            <span>Log off</span>
          </a>
        </aside>
       
        <div className={`${openDrawer ? "" : "collapsed-content"} content`} >
          {children}
        </div>
      </div>
    
    </div>
  )
}
