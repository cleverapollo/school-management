import React from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

import dayjs, { Dayjs } from 'dayjs';
import numeral from 'numeral';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Query, ResultSet } from '@cubejs-client/core';

type DayJsType = string | number | Date | Dayjs | null | undefined;
const numberFormatter = (item: DayJsType) => numeral(item).format('0,0');
const dateFormatter = (item: DayJsType) => dayjs(item).format('MMM YY');
const colors = ['#7DB3FF', '#49457B', '#FF7C78'];
const xAxisFormatter = (value: any, index: number): string => {
  // console.log('sdsdsdsdsd');
  // console.log(value);
  const item = value as DayJsType;
  if (dayjs(item).isValid()) {
    return dateFormatter(item);
  }
  return value as string;
};

export interface ChartRendererInternalProps {
  resultSet: ResultSet;
  children: any;
  ChartComponent: any;
  height: number;
  onclickEvent?: (a: any, b: any, c: any) => void;
}

// @ts-ignore
// eslint-disable-next-line react/prop-types

export const CartesianChart = ({
  resultSet,
  children,
  ChartComponent,
  height,
}: ChartRendererInternalProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <ChartComponent margin={{ left: -10 }} data={resultSet.chartPivot()}>
      <XAxis
        axisLine={false}
        tickLine={false}
        tickFormatter={xAxisFormatter}
        dataKey="x"
        minTickGap={20}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tickFormatter={numberFormatter}
      />
      <CartesianGrid vertical={false} />
      {children}
      <Legend />
      <Tooltip />
    </ChartComponent>
  </ResponsiveContainer>
);
