import React from 'react';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart, TimeScale, LinearScale, PointElement, LineElement, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(TimeScale, LinearScale, PointElement, LineElement, CategoryScale);

const AreaChart = ({ data, interval }: { data: { date: Date; count: number }[], interval: 'hour' | 'day' | 'month' | 'year' }) => {
    const chartData = {
      labels: data.map((entry) => new Date(entry.date).getTime()), // Ensure unique timestamps
      datasets: [
        {
          label: 'User Count',
          data: data.map((entry) => entry.count),
          fill: {
            target: 'origin',
            above: 'rgba(144, 238, 144, 0.4)', // Light green color with alpha transparency
          },
          backgroundColor: 'rgba(144, 238, 144, 0.3)', // Light green color with alpha transparency
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          tension: 1,
        },
      ],
    };
  
    const getToolTipFormat = (() => {
      switch (interval) {
        case 'day':
          return (time: number) => format(new Date(time), 'MMM d');
        case 'hour':
          return (time: number) => format(new Date(time), 'hh:mm');
        case 'month':
          return (time: number) => format(new Date(time), 'dd MM');
        case 'year':
          return (time: number) => format(new Date(time), 'MM, yyyy');
        default:
          return (time: number) => format(new Date(time), 'MMM d');
      }
    })();
  
    const chartOptions = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: interval,
            tooltipFormat: getToolTipFormat,
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          ticks: {
            precision: 0,
          },
          title: {
            display: true,
            text: 'User Count',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 20,
            boxHeight: 10,
          },
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };
  
  export default AreaChart;
  

