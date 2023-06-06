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
import { ChartRenderer, ChartRendererProps, PieChart } from '@tyro/core';
import { Query } from '@cubejs-client/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useMeasure } from 'react-use';
import { SessionAttendanceTable } from './session-attendance-table';
import { EmptyPieChart } from './empty-pie-chart';

dayjs.extend(LocalizedFormat);

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
      'OutputSessionsAttendance.colourAbsenceType',
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
  const { t } = useTranslation(['attendance', 'common']);
  const { activeAcademicNamespace, allNamespaces } = useAcademicNamespace();
  const [chartContainerRef, { width }] = useMeasure<HTMLDivElement>();
  const [selectedYear, setSelectedYear] = useState(activeAcademicNamespace);
  const selectedYearIndex =
    allNamespaces?.findIndex((year) => year?.year === selectedYear?.year) ?? 0;
  const previousYear =
    allNamespaces?.[selectedYearIndex - 1] ?? allNamespaces?.[0];
  const nextYear =
    allNamespaces?.[selectedYearIndex + 1] ??
    allNamespaces?.[allNamespaces.length - 1];

  const chartQuery = getChartQuery(studentId ?? 0, selectedYear?.year ?? 0);
  const chartDrilldownConfig: ChartRendererProps['drillDownConfig'] = {
    columns: [
      {
        field: 'OutputSessionsAttendance.absenceType',
        headerName: t('attendance:absenceType'),
      },
      {
        field: 'OutputSessionsAttendance.date',
        headerName: t('common:date'),
        cellRenderer: (value) =>
          typeof value === 'string' && dayjs(value).isValid()
            ? dayjs(value).format('l')
            : value,
      },
    ],
  };

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
          sx={{ p: 0, m: 0, border: 0, textAlign: 'center' }}
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
        <Stack
          ref={chartContainerRef}
          direction={width < 580 ? 'column' : 'row'}
          alignItems="center"
          justifyContent="center"
          sx={{ py: 4, px: 2 }}
          spacing={6}
        >
          <Box sx={{ maxWidth: 180, width: '100%' }}>
            <ChartRenderer
              query={chartQuery()}
              chartDefinition={PieChart({
                legend: { show: false },
                colorField: 'OutputSessionsAttendance.colourAbsenceType',
              })}
              drillDownConfig={chartDrilldownConfig}
              height={200}
              emptyState={<EmptyPieChart />}
            />
          </Box>
          <ChartRenderer
            query={chartQuery()}
            chartDefinition={SessionAttendanceTable()}
            drillDownConfig={chartDrilldownConfig}
            emptyState={
              <Box component="span" sx={{ maxWidth: 336 }}>
                {t('attendance:noSessionAttendanceForYear')}
              </Box>
            }
          />
        </Stack>
      </Box>
    </Card>
  );
}
