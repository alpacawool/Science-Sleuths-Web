/**
 * PieChart.jsx
 * Displays categorical data as a pie chart, such as
 * True or False or Multiple Choice.
 */
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Pie} from 'react-chartjs-2';
import { 
  getTrueFalseData,
  getMultipleChoiceData

} from './../../../../utilities/js/statistics.js'
 
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = (props) => {
  return (
    <div>
      {/* True or False */}
      {props.type === 0 &&
        <Pie
            data={{
            labels: ['True', 'False'],
            datasets: [
                {
                label: 'True or False',
                data: getTrueFalseData(props.observations, props.index),
                backgroundColor: [
                  '#00BCD4',
                  '#F8BBD0'
                ]
                }
            ]
            }}
        />
      }
      {/* Multiple Choice */}
      {props.type === 3 &&
        <Pie
            data={{
            labels: props.choices,
            datasets: [
              {
                label: 'Count',
                data: getMultipleChoiceData(
                    props.observations, 
                    props.index,
                    props.choices),
                backgroundColor: [
                  '#00BCD4',
                  '#FF9800',
                  '#E040FB',
                  '#4CAF50'
                ]
              }
            ]
            }}
        />
      }
    </div>
  )
}
