import { Page } from '@tyro/core';
import { Container, Grid, Typography } from '@mui/material';
import React from 'react';
import SinglePointChart from '../components/SinglePointChart';
import ChartRenderer from '../components/charts/ChartRenderer';
import { ApexPieChart } from '../components/charts/ApexPieChart';
import { ApexBarChart } from '../components/charts/ApexBarChart';

export default function StudentsListPage() {
  // @ts-ignore
  // @ts-ignore
  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          test report
        </Typography>
        <Typography variant="h3" component="h1" paragraph>
          test report
        </Typography>
        <div>Awol</div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {/* <SinglePointChart */}
            {/*  title="Awol" */}
            {/*  query={{ */}
            {/*    measures: ['AwolTest.count'], */}
            {/*  }} */}
            {/* /> */}

            <ChartRenderer
              query={{
                measures: ['AwolTest.count'],
              }}
              chartDefinition={ApexPieChart({
                legend: { floating: true, horizontalAlign: 'center' },
                dataLabels: { enabled: true, dropShadow: { enabled: false } },
                tooltip: {
                  fillSeriesColor: false,
                },
                plotOptions: {
                  pie: { donut: { labels: { show: false } } },
                },
                chart: {
                  type: 'pie',
                },
              })}
            />
            <ChartRenderer
              query={{
                measures: ['OutputSessionsAttendance.count'],
                order: {
                  'OutputSessionsAttendance.count': 'desc',
                },
                dimensions: [
                  'OutputSessionsAttendance.absenceType',
                  'OutputSessionsAttendance.studentFullName',
                  'OutputSessionsAttendance.studentPartyId',
                ],
                filters: [
                  {
                    member: 'OutputSessionsAttendance.schoolYear',
                    operator: 'equals',
                    values: ['2022'],
                  },
                  {
                    member: 'OutputSessionsAttendance.studentPartyId',
                    operator: 'equals',
                    values: ['676'],
                  },
                ],
              }}
              chartDefinition={ApexPieChart()}
            />
            <ChartRenderer
              query={{
                measures: ['OutputSessionsAttendance.count'],
                order: {
                  'OutputSessionsAttendance.count': 'desc',
                },
                timeDimensions: [
                  {
                    dimension: 'OutputSessionsAttendance.date',
                    granularity: 'month',
                  },
                ],
                dimensions: [
                  'OutputSessionsAttendance.absenceType',
                  'OutputSessionsAttendance.studentFullName',
                  'OutputSessionsAttendance.studentPartyId',
                ],
                filters: [
                  {
                    member: 'OutputSessionsAttendance.schoolYear',
                    operator: 'equals',
                    values: ['2022'],
                  },
                  {
                    member: 'OutputSessionsAttendance.absenceType',
                    operator: 'notEquals',
                    values: ['Pre'],
                  },
                  {
                    member: 'OutputSessionsAttendance.studentPartyId',
                    operator: 'equals',
                    values: ['676'],
                  },
                ],
              }}
              chartDefinition={ApexBarChart}
            />

            <ChartRenderer
              query={{
                measures: ['OutputLessonAttendance.count'],
                order: {
                  'OutputLessonAttendance.count': 'desc',
                },
                dimensions: [
                  'OutputLessonAttendance.absenceType',
                  'OutputLessonAttendance.subjectName',
                  'OutputLessonAttendance.studentFullName',
                  'OutputLessonAttendance.studentPartyId',
                ],
                filters: [
                  {
                    member: 'OutputLessonAttendance.schoolYear',
                    operator: 'equals',
                    values: ['2022'],
                  },
                  {
                    member: 'OutputLessonAttendance.studentPartyId',
                    operator: 'equals',
                    values: ['676'],
                  },
                ],
              }}
              chartDefinition={ApexBarChart}
            />
            <ChartRenderer
              query={{
                measures: ['OutputLessonAttendance.count'],
                order: {
                  'OutputLessonAttendance.count': 'desc',
                },
                dimensions: [
                  'OutputLessonAttendance.isPresent',
                  'OutputLessonAttendance.subjectName',
                  'OutputLessonAttendance.studentFullName',
                  'OutputLessonAttendance.studentPartyId',
                ],
                filters: [
                  {
                    member: 'OutputLessonAttendance.schoolYear',
                    operator: 'equals',
                    values: ['2022'],
                  },
                  {
                    member: 'OutputLessonAttendance.studentPartyId',
                    operator: 'equals',
                    values: ['676'],
                  },
                ],
              }}
              chartDefinition={ApexBarChart}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
