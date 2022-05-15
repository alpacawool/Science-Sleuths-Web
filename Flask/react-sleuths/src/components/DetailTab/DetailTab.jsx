/**
 * DetailTab.jsx
 * Handles tabs on project detail page
 */
import {useState} from 'react'
import {Box, Tab} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import { ResponseTable } from './ResponseTable/ResponseTable'
import { SummaryPanel } from './SummaryPanel/SummaryPanel'
import './DetailTab.scss'


export const DetailTab = (props) => {
  const [currentTab, setCurrentTab] = useState('1');
  
  const handleChange = (event, newTab) => {
    setCurrentTab(newTab)
  }

  return (
    <Box className='detail-tab-container'>
        <TabContext value = {currentTab}>
            <Box>
                <TabList 
                  aria-label='Project Detail Tabs' 
                  onChange={handleChange} 
                  textColor="inherit"
                >
                    <Tab label='Responses' value='1'/>
                    <Tab label='Summary' value='2'/>
                </TabList>
           
            </Box>
            <TabPanel value='1'>
              <ResponseTable
                questions={props.questions}
                observations={props.observations}
                {...props}
              />
            </TabPanel>

            <TabPanel value='2'>
              <SummaryPanel
                questions={props.questions}
                observations={props.observations}
              />
            </TabPanel>

        </TabContext>
    </Box>
  )
}
