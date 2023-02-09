import { Page } from '@tyro/core';
import { Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { Query } from '@cubejs-client/core';
import ChartRenderer from '../components/charts/ChartRenderer';
import { ApexPieChart } from '../components/charts/ApexPieChart';
import { ApexBarChart } from '../components/charts/ApexBarChart';

function absenceTypesForStudent(): Query {
  return {
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
  };
}

function absenceTypeByMonthForStudent(): Query {
  return {
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
  };
}

function attendedSubjectLessonsForStudent(): Query {
  return {
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
  };
}

function attendanceCodeBySubjectForStudent(): Query {
  return {
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
  };
}
export default function StudentsListPage() {
  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          test report
        </Typography>
        <div>Awol</div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ChartRenderer
              query={absenceTypesForStudent()}
              chartDefinition={ApexPieChart()}
              drillDownDisplayColumns={[
                'OutputSessionsAttendance.absenceType',
                'OutputSessionsAttendance.date',
              ]}
            />
            <ChartRenderer
              query={absenceTypeByMonthForStudent()}
              chartDefinition={ApexBarChart}
            />

            <ChartRenderer
              query={attendanceCodeBySubjectForStudent()}
              chartDefinition={ApexBarChart}
            />
            <ChartRenderer
              query={attendedSubjectLessonsForStudent()}
              chartDefinition={ApexBarChart}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
