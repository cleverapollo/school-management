import React from 'react';
import { DrillDownLocator, ResultSet } from '@cubejs-client/core';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { merge } from 'lodash';
import { BaseOptionChart } from './BaseOptionChart';
import { DataLayoutType, transformData } from './ApexTransformers';
import { ChartDefinition, ChartRendererInternalProps } from './ChartRenderer';

const colors = ['#7DB3FF', '#49457B', '#FF7C78'];

interface ApexTransformedData {
  series: any[];
  categories: string[];
}
const displayComponent = ({
  resultSet,
  height,
  onclickEvent,
}: ChartRendererInternalProps) => {
  const transformed = transformData(resultSet, DataLayoutType.TwoDimension);
  if (transformed === undefined) {
    <div>error</div>;
  }
  const chartOptions: ApexOptions = merge(BaseOptionChart(), {
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
        dataPointSelection: onclickEvent,
      },
    },
  });
  return (
    <ReactApexChart
      type="bar"
      series={transformed?.series}
      options={chartOptions}
      height={400}
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
    const xfilterValues = resultSet.chartPivot()[datapointIndex].xValues;
    // todo are indexs always the same here??

    const locator = {
      xValues: resultSet.chartPivot()[datapointIndex].xValues,
      yValues: yFilters,
    } as DrillDownLocator;
    return resultSet.drillDown(locator);
  }

  //
  //
  //

  //
  //
  //

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
};

export const ApexBarChart = {
  component: displayComponent,
  drillDownQuery: drilldownLocationFunction,
} as ChartDefinition;
