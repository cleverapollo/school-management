import { Page } from '@tyro/core';
import {
  CardProps,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCubeQuery } from '@cubejs-client/react';
import { Query } from '@cubejs-client/core';
import React, { useState } from 'react';
import AnalyticsWidgetSummary from './AnalyticsWidgetSummary';

interface Props extends CardProps {
  title: string;
  query: Query;
}

export default function SinglePointChart({
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

  // console.log(resultSet);
  if (isLoading) {
    return <div>{progress?.stage || 'Loading...'}</div>;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return null;
  }

  const handleBarClick = () => {
    // @ts-ignore
    // @ts-ignore
    const t = resultSet.drillDown({
      // AwolTest.classGroupName
      xValues: [],
      yValues: ['AwolTest.count'],
    });
    if (t != null) {
      setDrillDownQuery(t);
    }

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // console.log('resultSet.chartPivot()');
  // console.log(resultSet.chartPivot());
  // console.log(resultSet.rawData());
  // const dataSource = resultSet.tablePivot();
  // const columns = resultSet.tableColumns();
  const result = resultSet.rawData()[0]['AwolTest.count'] as number;
  return (
    <>
      <AnalyticsWidgetSummary
        title="AWOL"
        total={result}
        onClick={handleBarClick}
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
