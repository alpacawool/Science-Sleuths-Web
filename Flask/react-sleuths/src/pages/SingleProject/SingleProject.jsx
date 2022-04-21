/**
 * SingleProject.jsx 
 * Individual Project page that shows a single project from a single user
 * Displays a tabbed menu to switch between a table view and summary  view
 * Makes asynchronous calls to retrieve project summary and observations
 */

import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Grid} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { DetailTab } from '../../components/DetailTab/DetailTab'

import './SingleProject.scss'

const SingleProject = () => {

  const {project_id} = useParams()
  const [project, setProject] = useState({})
  const [observations, setObservations] = useState({})

  // Retrieve project summary
  useEffect(() => {
    fetch(`/projects/${project_id}`)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(data => setProject(data))
      .then(error => console.log(error))
  }, [])

  // Retrieve project observations
  useEffect(() => {
    fetch(`/projects/${project_id}/observations`)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(data => setObservations(data))
      .then(error => console.log(error))
  }, [])


  return (

    <div>
      {project !== {} ? 
        <Grid container
          spacing="1rem"
          className='single-project-container'
        >
          <Grid item xs={12} sm={6}>
            <h1>{project.title}</h1>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div className='project-code-container'>
              <span className='project-code-title'>Code</span>
              <div className='project-code-string'>
                <ContentCopyIcon className='project-code-icon'/>
                {project_id}
                </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} className='description-container'>
            <span className='description-paragraph-title'>Description</span>
            <p className="description-paragraph">
            {project.description}
            
            </p>
          </Grid>

          <Grid item xs={12} sm={6}>
            <button className='download-csv-button'>
              <DownloadIcon className='download-csv-icon'/>
              {/* TODO: Add CSV download functionality */}
              Export .csv
            </button>
          </Grid>
          <Grid item xs={12}>
            {/* If there are observations for the current project,
            render the table and summary tabs. */}
            {observations.length > 0 ?
              <DetailTab
                questions={project.questions}
                observations={observations}
              />
              : 
              <p>There are no observations yet.</p>
              }
          </Grid>
   
        </Grid>
    
        : 
        // Project hasn't been defined yet, do not render data
        <p></p>
      }

    </div>
  )
}

export default SingleProject