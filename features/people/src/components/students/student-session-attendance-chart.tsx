import {
  Box,
  Button,
  Card,
  CardHeader,
  Fade,
  IconButton,
  Stack,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useAcademicNamespace } from '@tyro/api';
import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@tyro/icons';
import { Link } from 'react-router-dom';
import { ChartRenderer, ApexPieChart } from '@tyro/reporting';
import { Query } from '@cubejs-client/core';

interface StudentSessionAttendanceChartProps {
  studentId: number | undefined;
}

function getChartQuery(studentId: number, year: number) {
  return (): Query => ({
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
        values: [String(year)],
      },
      {
        member: 'OutputSessionsAttendance.studentPartyId',
        operator: 'equals',
        values: [String(studentId)],
      },
    ],
  });
}

function getYearString(year: number | undefined) {
  if (!year) return '';

  const last2Digits = year.toString().slice(-2);
  return `${year}/${Number(last2Digits) + 1}`;
}

export function StudentSessionAttendanceChart({
  studentId,
}: StudentSessionAttendanceChartProps) {
  const [t] = useTranslation(['attendance']);
  const { activeAcademicNamespace, allNamespaces } = useAcademicNamespace();
  const [selectedYear, setSelectedYear] = useState(activeAcademicNamespace);
  const selectedYearIndex =
    allNamespaces?.findIndex((year) => year?.year === selectedYear?.year) ?? 0;
  const previousYear =
    allNamespaces?.[selectedYearIndex - 1] ?? allNamespaces?.[0];
  const nextYear =
    allNamespaces?.[selectedYearIndex + 1] ??
    allNamespaces?.[allNamespaces.length - 1];

  console.log({
    activeAcademicNamespace,
    selectedYear,
  });

  const chartQuery = getChartQuery(studentId ?? 0, selectedYear?.year ?? 0);

  const setPreviousYear = () => {
    if (previousYear) {
      setSelectedYear(previousYear);
    }
  };

  const setNextYear = () => {
    if (nextYear) {
      setSelectedYear(nextYear);
    }
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 3,
          pr: 2,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <Fade in={selectedYearIndex !== 0}>
          <Button
            disabled={selectedYearIndex === 0}
            onClick={setPreviousYear}
            startIcon={<ChevronLeftIcon />}
            size="small"
          >
            {getYearString(previousYear?.year)}
          </Button>
        </Fade>
        <CardHeader
          component="h3"
          title={t('attendance:sessionAttendanceYear', {
            year: getYearString(selectedYear?.year),
          })}
          sx={{ p: 0, m: 0 }}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Fade in={selectedYearIndex !== (allNamespaces?.length ?? 0) - 1}>
            <Button
              disabled={selectedYearIndex === (allNamespaces?.length ?? 0) - 1}
              onClick={setNextYear}
              endIcon={<ChevronRightIcon />}
              size="small"
            >
              {getYearString(nextYear?.year)}
            </Button>
          </Fade>
          <IconButton
            component={Link}
            to={
              selectedYear?.year
                ? `../attendance?year=${selectedYear?.year}`
                : '../attendance'
            }
          >
            <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
      </Stack>
      <Box
        sx={{
          borderWidth: '1px 0 0 0',
          borderStyle: 'solid',
          borderColor: 'divider',
        }}
      >
        <ChartRenderer
          query={chartQuery()}
          chartDefinition={ApexPieChart()}
          drillDownDisplayColumns={[
            'OutputSessionsAttendance.subjectGroupName',
            'OutputSessionsAttendance.absenceType',
            'OutputSessionsAttendance.date',
          ]}
        />
      </Box>
    </Card>
  );
}
