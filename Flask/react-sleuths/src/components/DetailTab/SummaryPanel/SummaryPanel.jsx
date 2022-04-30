/**
 * SummaryPanel.jsx
 * Display summary of individual project
 */

import {Grid} from '@mui/material'
import { BarChart } from './Charts/BarChart'
import { PieChart } from './Charts/PieChart'
import './SummaryPanel.scss'


export const SummaryPanel = (props) => {

  
  return (
    <div className="summary-panel-container">
         
        <Grid container alignItems="center">
            <Grid item xs={12}>
                Total Responses: 
                <span className='stat-num'>
                  {props.observations.length}
                </span>
            </Grid>


            {/* Only display question types that have a chart so far */}
            {props.questions.map((question, index) => {
              return question.type < 4 ?
        
              <Grid item xs={12} sm={6} key={index} className='chart-item'>

                <span className='question-chart-prompt'>
                  Q{index+1}. {question.prompt}
                </span>
                  
                  {/* 0 - TRUE or FALSE - Pie */}
                  {question.type === 0 &&
                     <PieChart 
                        observations = {props.observations}
                        index={index}
                        type = {question.type}
                     />
                  }

                  {/* 1, 2 - Whole Number / Decimal - Bar Chart */}
                  {question.type === 1 &&
                    <BarChart 
                      observations = {props.observations}
                      index={index}
                      type = {question.type}
                    />
                  }
                  {question.type === 2 &&
                    <BarChart 
                      observations = {props.observations}
                      index={index}
                      type = {question.type}
                    />
                  }

                  {/* 3 - Multiple Choice - Pie */}
                  {question.type === 3 &&
                     <PieChart 
                        observations = {props.observations}
                        index={index}
                        type = {question.type}
                        choices = {question.choices}
                     />
                  }    

              </Grid>
              : 
              null
              })}
              
        </Grid>
    </div>
  )
}
