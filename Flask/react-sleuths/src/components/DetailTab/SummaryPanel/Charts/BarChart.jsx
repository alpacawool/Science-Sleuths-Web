import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
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
            'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            ],
            borderWidth: 1
        }]
    }}
    />
  )
}
