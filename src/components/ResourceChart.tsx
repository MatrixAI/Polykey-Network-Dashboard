import * as React from 'react';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  Colors,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

const registerList = [
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
  Legend,
  Colors,
  zoomPlugin,
];

function ResourceChart({
  data,
  ...props
}: {
  data: {
    [nodeId: string]: {
      timestamps: number[];
      values: number[];
    };
  };
} & React.HTMLAttributes<HTMLCanvasElement>) {
  const [isRegistered, setIsRegistered] = React.useState(false);
  React.useEffect(() => {
    ChartJS.register(...registerList);
    setIsRegistered(true);
    return () => {
      setIsRegistered(false);
      ChartJS.unregister(...registerList);
    };
  }, []);
  const timestamps = Object.values(data).at(0)?.timestamps ?? [];
  return isRegistered ? (
    <Line
      datasetIdKey="id"
      data={{
        labels: timestamps,
        datasets: Object.entries(data).map(([nodeId, data]) => ({
          label: nodeId,
          data: data.values,
        })),
      }}
      options={{
        scales: {
          x: {
            type: 'time',
          },
          y: {
            ticks: {
              callback: (value) => {
                return value + '%';
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => {
                return item.formattedValue + '% Usage';
              },
            },
          },
          colors: {
            enabled: true,
          },
          zoom: {
            zoom: {
              pinch: {
                enabled: true,
              },
              wheel: {
                enabled: true,
              },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
            limits: {
              x: {
                min: timestamps.at(-1),
                max: timestamps.at(0),
              },
            },
          },
        },
        elements: {
          point: {
            pointStyle: false,
          },
        },
      }}
      {...props}
    />
  ) : (
    <></>
  );
}

export default ResourceChart;
