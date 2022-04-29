import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
    getNumericLabels, 
    getNumericData
} from './../../../../utilities/js/statistics.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  

export const BarChart = (props) => {
  return (
    <Bar 
    data = {{
        labels: getNumericLabels(props.observations),
        datasets: [{
            data: getNumericData(props.observations, props.index),
            backgroundColor: [
            '#009688',
            ],
            borderColor: [
            '#009688',
            ],
            borderWidth: 1
        }]
    }}
    options = {{
      plugins:{   
        legend: {
          display: false
        },
      },
      scales: { 
        x: {
          title: {
            display: true,
            text: 'Response Number'
          },
          ticks : {
            display: false
          }
        }
      }

    }}
    />
  )
}
