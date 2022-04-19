import {useState}from 'react'

import {Box, Tab} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'

import './DetailTab.scss'
import { ResponseTable } from './ResponseTable/ResponseTable'

export const DetailTab = () => {
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
              <ResponseTable />
            </TabPanel>

            <TabPanel value='2'>
              Summary Panel
            </TabPanel>

        </TabContext>
    </Box>
  )
}
