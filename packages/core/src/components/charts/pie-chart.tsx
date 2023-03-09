import { DrillDownLocator, ResultSet } from '@cubejs-client/core';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useChartOptions } from '../../hooks/use-chart-options';
import { ChartDefinition, ChartRendererInternalProps } from './chart-renderer';

interface ApexTransformedData {
  series: number[];
  categories: string[];
  colors?: string[] | undefined;
}

const transformData = (
  resultSet: ResultSet,
  colorField: string | undefined
): ApexTransformedData | undefined => {
  const measures = resultSet.query().measures || [];
  const dimensions = resultSet.query().dimensions || [];
  if (measures.length !== 1) {
    return undefined;
  }
  const measure = measures[0];
  const dimension = dimensions[0];
  const series: number[] = [];
  const categories: string[] = [];
  const colors: string[] = [];

  resultSet.tablePivot().forEach((row) => {
    series.push(Number(row[measure]));
    categories.push(row[dimension] as string);
    if (colorField) {
      colors.push(row[colorField] as string);
    }
  });

  return {
    series,
    categories,
    colors: colors.length ? colors : undefined,
  };
};

const DisplayComponent = ({
  resultSet,
  height = 280,
  onClick,
  emptyState,
  options,
}: ChartRendererInternalProps & {
  options: ApexOptions & { colorField?: string };
}) => {
  const { palette } = useTheme();
  const { colorField, ...remainingOptions } = options;
  const transformed = useMemo(
    () => transformData(resultSet, colorField),
    [resultSet, colorField]
  );
  const colorsMappedToTheme = useMemo(() => {
    if (transformed?.colors) {
      const mappedColors = transformed.colors
        .map((color) => {
          const mappedColor = palette[color as keyof typeof palette];
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return mappedColor?.['500'];
        })
        .filter((color) => color !== undefined);

      return mappedColors.length ? mappedColors : undefined;
    }

    return undefined;
  }, [palette, transformed?.colors]);

  const chartOptions = useChartOptions(
    'donut',
    {
      ...(colorsMappedToTheme ? { colors: colorsMappedToTheme } : {}),
      labels: transformed?.categories,
      chart: {
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

  if (emptyState && transformed?.series && transformed?.series?.length === 0) {
    return emptyState;
  }

  return (
    <ReactApexChart
      type="donut"
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const index = c.dataPointIndex as number;
  const xfilterValues = resultSet.chartPivot()[index].xValues;

  const locator = {
    xValues: xfilterValues,
    yValues: [],
  } as DrillDownLocator;
  return resultSet.drillDown(locator);
};

export const PieChart = (
  options: ApexOptions & { colorField?: string } = {}
): ChartDefinition => ({
  component: (props) => <DisplayComponent {...props} options={options} />,
  drillDownQuery: drilldownLocationFunction,
});
