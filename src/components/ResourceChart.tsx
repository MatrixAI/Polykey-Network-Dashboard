import * as React from 'react';
import { Line } from 'react-chartjs-2';

function ResourceChart({
  data,
  title,
  ...props
}: {
  data: {
    [nodeId: string]: {
      timestamps: number[];
      values: number[];
    };
  };
  title?: string;
} & React.HTMLAttributes<HTMLCanvasElement>) {
  const [isRegistered, setIsRegistered] = React.useState(false);
  React.useEffect(() => {
    const registerList: Array<any> = [];
    void (async () => {
      const chartJs = await import('chart.js');
      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      await import('chartjs-adapter-date-fns');
      registerList.push(
        chartJs.CategoryScale,
        chartJs.LinearScale,
        chartJs.PointElement,
        chartJs.LineElement,
        chartJs.Title,
        chartJs.Tooltip,
        chartJs.Legend,
        chartJs.TimeScale,
        chartJs.TimeSeriesScale,
        chartJs.Colors,
        zoomPlugin,
      );
      chartJs.Chart.register(...registerList);
      setIsRegistered(true);
    })();
    return () => {
      void import('chart.js').then((chartJs) => {
        chartJs.Chart.unregister(...registerList);
        setIsRegistered(false);
      });
    };
  }, []);
  const timestamps = Object.values(data).at(0)?.timestamps ?? [];
  return isRegistered ? (
    <Line
      title={title}
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
            min: 0,
            max: 100,
            ticks: {
              callback: (value) => {
                return value + '%';
              },
            },
          },
        },
        plugins: {
          title: {
            display: title != null,
            text: title,
          },
          tooltip: {
            callbacks: {
              label: (item) => {
                return item.formattedValue + '%';
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
                min: timestamps.at(0),
                max: timestamps.at(-1),
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
      height={200}
      {...props}
    />
  ) : (
    <></>
  );
}

export default ResourceChart;
