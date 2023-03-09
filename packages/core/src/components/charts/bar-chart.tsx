import { useMemo } from 'react';
import { DrillDownLocator, ResultSet } from '@cubejs-client/core';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useChartOptions } from '../../hooks/use-chart-options';
import { transformData } from './chart-transformer';
import { ChartDefinition, ChartRendererInternalProps } from './chart-renderer';

const DisplayComponent = ({
  resultSet,
  height = 280,
  onClick,
  options,
}: ChartRendererInternalProps & {
  options: ApexOptions & { colorField?: string };
}) => {
  const { colorField, ...remainingOptions } = options;
  const transformed = useMemo(() => transformData(resultSet), [resultSet]);
  const chartOptions = useChartOptions(
    'bar',
    {
      legend: { floating: true, horizontalAlign: 'center' },
      dataLabels: { enabled: true, dropShadow: { enabled: false } },
      labels: transformed?.categories,
      tooltip: {
        fillSeriesColor: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      chart: {
        stacked: true,
        stackType: '100%',
        events: {
          dataPointSelection: onClick,
        },
      },
    },
    remainingOptions
  );

  if (transformed === undefined) {
    <div>error</div>;
  }

  return (
    <ReactApexChart
      type="bar"
      series={transformed?.series}
      options={chartOptions}
      height={height}
    />
  );
};

const drilldownLocationFunction = (
  resultSet: ResultSet,
  a: any,
  b: any,
  c: any
): any => {
  if ((resultSet.query().timeDimensions || []).length > 0) {
    const datapointIndex = c.dataPointIndex as number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const seriesIndex = c.seriesIndex as number;
    const foundKeys = Object.keys(resultSet.chartPivot()[0]).filter(
      (k) => k !== 'x' && k !== 'xValues'
    );

    const measures = resultSet.query().measures || [];
    const yFilters = foundKeys[seriesIndex]
      .split(',')
      .filter((k) => !measures.includes(k));

    const locator = {
      xValues: resultSet.chartPivot()[datapointIndex].xValues,
      yValues: yFilters,
    } as DrillDownLocator;
    return resultSet.drillDown(locator);
  }

  const datapointIndex = c.dataPointIndex as number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const seriesIndex = c.seriesIndex as number;

  const dimensions = resultSet.query().dimensions || [];
  const chartData = resultSet.chartPivot({
    y: [dimensions[0]],
  });
  const foundKeys = Object.keys(chartData[0]).filter(
    (k) => k !== 'x' && k !== 'xValues'
  );

  const measures = resultSet.query().measures || [];
  const maindatapoint = foundKeys[seriesIndex]
    .split(',')
    .filter((k) => !measures.includes(k));
  const xfilterValues = chartData[datapointIndex].xValues;
  // todo are indexs always the same here??
  const xValues = maindatapoint.concat(xfilterValues);

  const locator = {
    xValues,
    yValues: [],
  } as DrillDownLocator;

  return resultSet.drillDown(locator);
};

export const BarChart = (
  options: ApexOptions & { colorField?: string } = {}
): ChartDefinition => ({
  component: (props) => <DisplayComponent {...props} options={options} />,
  drillDownQuery: drilldownLocationFunction,
});
