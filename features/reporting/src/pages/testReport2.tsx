import { Page } from '@tyro/core';
import {
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
import { Maybe } from '@tyro/api';
import AnalyticsWidgetSummary from '../components/AnalyticsWidgetSummary';

export default function StudentsListPage() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: ['AwolTest.count'],
  });

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

  const handleBarClick = () => {
    // @ts-ignore
    // @ts-ignore
    const query = resultSet.drillDown({
      xValues: [''],
      yValues: ['AwolTest.count'],
    });
    if (query != null) {
      setDrillDownQuery(query);
    }

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log('resultSet.chartPivot()');
  console.log(resultSet.chartPivot());
  console.log(resultSet.rawData());
  const dataSource = resultSet.tablePivot();
  const columns = resultSet.tableColumns();
  const result = resultSet.rawData()[0]['AwolTest.count'] as number;
  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          test report
        </Typography>
        <div>{resultSet.rawData()[0]['AwolTest.count']}</div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="AWOL"
              total={result}
              onClick={handleBarClick}
            />
          </Grid>
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set backup account</DialogTitle>
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
    </Page>
  );
}
