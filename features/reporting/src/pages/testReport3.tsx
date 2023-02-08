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
import OneDimensionChart from '../components/OneDimensionChart';

export default function StudentsListPage() {
  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          test report
        </Typography>
        <OneDimensionChart
          title="Awol"
          query={{
            measures: ['AwolTest.count'],
          }}
        />
      </Container>
    </Page>
  );
}
