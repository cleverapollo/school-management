import React from 'react';
import { DrillDownLocator, ResultSet } from '@cubejs-client/core';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { merge } from 'lodash';
import { ChartRendererInternalProps } from './CartesianChart';
import { BaseOptionChart } from './BaseOptionChart';
import { ChartDefinition } from './ChartRenderer';

const colors = ['#7DB3FF', '#49457B', '#FF7C78'];

interface ApexTransformedData {
  series: number[];
  categories: string[];
}

const transformData = (
  resultSet: ResultSet
): ApexTransformedData | undefined => {
  const measures = resultSet.query().measures || [];
  const dimensions = resultSet.query().dimensions || [];
  if (measures.length !== 1) {
    return undefined;
  }
  const measure = measures[0];
  const dimension = dimensions[0];
  const series = [] as number[];
  const categories = [] as string[];
  // eslint-disable-next-line vars-on-top,no-plusplus,no-var
  for (var i = 0; i < resultSet.tablePivot().length; i++) {
    series.push(Number(resultSet.tablePivot()[i][measure]));
    categories.push(resultSet.tablePivot()[i][dimension] as string);
  }

  return {
    series,
    categories,
  };
};
const displayComponent = ({
  resultSet,
  height,
  onclickEvent,
}: ChartRendererInternalProps) => {
  const transformed = transformData(resultSet);
  if (transformed === undefined) {
    <div>error</div>;
  }
  const chartOptions: ApexOptions = merge(BaseOptionChart(), {
    chart: {
      labels: transformed?.categories,
      events: {
        dataPointSelection: onclickEvent,
      },
    },
  });
  return (
    <ReactApexChart
      type="donut"
      series={transformed?.series}
      options={chartOptions}
      height={280}
    />
  );
};

const drilldownLocationFunction = (
  resultSet: ResultSet,
  a: any,
  b: any,
  c: any
): any => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const index = c.dataPointIndex as number;
  const xfilterValues = resultSet.chartPivot()[index].xValues;

  const locator = {
    xValues: xfilterValues,
    yValues: [],
  } as DrillDownLocator;
  return resultSet.drillDown(locator);
};

export const ApexPieChart = (options?: ApexOptions): ChartDefinition => ({
  component: ({
    resultSet,
    height,
    onclickEvent,
  }: ChartRendererInternalProps) => {
    const transformed = transformData(resultSet);
    if (transformed === undefined) {
      <div>error</div>;
    }
    const userMergedOptions = merge(BaseOptionChart(), options);
    const chartOptions: ApexOptions = merge(userMergedOptions, {
      chart: {
        events: {
          dataPointSelection: onclickEvent,
        },
      },
    });
    return (
      <ReactApexChart
        type="donut"
        series={transformed?.series}
        options={chartOptions}
        height={280}
      />
    );
  },
  drillDownQuery: drilldownLocationFunction,
});
