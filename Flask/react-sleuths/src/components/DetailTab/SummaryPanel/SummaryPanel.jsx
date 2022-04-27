/**
 * SummaryPanel.jsx
 * Display summary of individual project
 */

import {Grid} from '@mui/material'
import { BarChart } from './Charts/BarChart'
import { PieChart } from './Charts/PieChart'

export const SummaryPanel = (props) => {

  return (
    <div className="summary-panel-container">
         
        <Grid container>
            <Grid xs={12}>
                Total Responses: 
                <h1>{props.observations.length}</h1>
            </Grid>

            {props.questions.map((question, index) =>
              <Grid item xs={12} sm={6}>
                  Q{index+1}. {question.prompt}
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

              </Grid>)}
        </Grid>
    </div>
  )
}
