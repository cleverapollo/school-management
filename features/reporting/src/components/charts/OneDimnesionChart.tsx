import {
  CardProps,
  Dialog,
  DialogTitle,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Query } from '@cubejs-client/core';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { merge } from 'lodash';
import { useCubeQuery } from '@cubejs-client/react';
// eslint-disable-next-line import/named
import { ApexOptions } from 'apexcharts';
import { BaseOptionChart } from './BaseOptionChart';

interface Props extends CardProps {
  title: string;
  query: Query;
}

export default function OneDimensionChart({
  title,
  query,
  color = 'primary',
  sx,
  ...other
}: Props) {
  const { resultSet, isLoading, error, progress } = useCubeQuery(query);

  const [drillDownQuery, setDrillDownQuery] = useState<Query>();
  const [open, setOpen] = useState(false);

  // @ts-ignore
  const drillDownResponse = useCubeQuery(drillDownQuery, {
    skip: !drillDownQuery,
  });

  const drillDownData = () =>
    (drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot()) ||
    [];

  console.log(resultSet);

  if (isLoading) {
    return <div>{progress?.stage || 'Loading...'}</div>;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return null;
  }
  const handleBarClick = (event?: any, chartContext?: any, config?: any) => {
    console.log(event);
    if (event != null) {
      // setDrillDownQuery(
      //   resultSet.drillDown({
      //     xValues: 'event.xValues',
      //     yValues,
      //   })
      // );
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const chartOptions: ApexOptions = merge(BaseOptionChart(), {
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    labels: ['Apple', 'Mango', 'Banana', 'Papaya'],
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
    chart: {
      events: {
        dataPointSelection: handleBarClick,
      },
    },
  });
  console.log('resultSet.chartPivot()');
  console.log(resultSet.chartPivot());
  console.log(resultSet.rawData());
  const dataSource = resultSet.tablePivot();
  const columns = resultSet.tableColumns();
  return (
    <>
      <ReactApexChart
        type="pie"
        series={[44, 145, 2, 67]}
        options={chartOptions}
        height={280}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <div>
          {drillDownResponse.isLoading ? (
            'Loading...'
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(drillDownData()[0] || []).map((key) => (
                      <TableCell>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {drillDownData().map((row) => (
                  <TableRow>
                    {Object.keys(row).map((key) => (
                      <TableCell> {row[key]} </TableCell>
                    ))}
                  </TableRow>
                ))}
              </Table>
            </TableContainer>
          )}
        </div>
      </Dialog>
    </>
  );
}
