import React from 'react';
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
import { getLocalStorageDataFromKey } from '../Utils';
import { STATS_KEY } from '../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Bar Chart',
    // },
    tooltip: {
      // enabled: false,
      callbacks: {
        label: (context) => {
          // let label = context.dataset.label || '';
          // if (label) label += ': ';
          let label = '';
          if (context.parsed.y !== null) {
            // label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            label += context.parsed.y + ' songs';
          }
          return label;
        },
      },
    },
  },
  scale: {
    ticks: {
      precision: 0,
    },
  },
};

import styles from '../css/app.module.scss';

import Button from '../components/Button';
import { stageToTime } from '../logic';

class Stats extends React.Component {
  state = {
    // // What guess you're on
    // stage: 0,
    // // The current guess
    // guess: '',
    // // Past guesses
    // guesses: [],
    // gameState: GameState.Playing,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    // const labels = ['1s', '2s', '4s', '7s', '11s', '16s', '>16s', 'gave up'];
    const savedStats = getLocalStorageDataFromKey(STATS_KEY, {});
    const parsedStats = Object.entries(savedStats)
      .reduce((accum, [key, value]) => {
        const stage = parseInt(key, 10);
        // I pass in -1 when saving if they gave up
        if (stage === -1) {
          accum['gave up'] = value;
        } else if (stage > 5) { // >16s
          const longOnes = accum['>16s'] || 0;
          accum['>16s'] = longOnes + value;
        } else { // stage is 0-5, output seconds
          const time = stageToTime(stage);
          accum[`${time}s`] = value;
        }
        return accum;
      }, {});

    const data = {
      labels: Object.keys(parsedStats),
      datasets: [
        {
          label: 'Dataset 1',
          data: Object.values(parsedStats),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    console.log(data);

    return (
      <>
        <div className={styles.container}>
          <h1 className={styles.title}>{'🎵 Name That Tune'}</h1>
          <h2>Stats</h2>
          <Bar options={options} data={data} />
        </div>
      </>
    );
  }
}

export default Stats;
