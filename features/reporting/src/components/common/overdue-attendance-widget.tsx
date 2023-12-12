import { Card, IconButton, Stack, Typography, Box, Chip } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { LoadingPlaceholderContainer } from '@tyro/core';
import { Colour } from '@tyro/api';
import { useMemo } from 'react';
import { useRunReports } from '../../api/run-report';
import { getReportUrl, Report } from '../../utils/get-report-url';

type ReportColumnValue = {
  value: string;
};

type OverdueAttendanceData = {
  id: ReportColumnValue;
  colour: {
    value: Colour;
  };
  overdue_by_mins: ReportColumnValue;
  subject_group_name: ReportColumnValue;
  subject_name_1: ReportColumnValue;
}[];

export function OverdueAttendanceWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const toDate = dayjs();
  const fromDate = toDate.subtract(10, 'day');

  const { data, isLoading } = useRunReports({
    topReportId: 'overdue-lesson-attendance',
    filter: {
      reportId: 'overdue-lesson-attendance',
      filters: [
        {
          filterId: 'from_date',
          filterValue: fromDate.format('YYYY-MM-DD'),
        },
        {
          filterId: 'to_date',
          filterValue: toDate.format('YYYY-MM-DD'),
        },
      ],
    },
  });

  const overdueAttendances = useMemo(() => {
    const overdueAttendancesData = (data?.data ?? []) as OverdueAttendanceData;

    return overdueAttendancesData.slice(0, 5).map((overdueAttendance) => ({
      id: overdueAttendance.id.value,
      colour: overdueAttendance.colour.value,
      overdueByMins: overdueAttendance.overdue_by_mins.value,
      subjectGroupName: overdueAttendance.subject_group_name.value,
      subjectName: overdueAttendance.subject_name_1.value,
    }));
  }, [data]);

  return (
    <Card
      variant="soft"
      sx={{
        flex: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
        mb={1}
      >
        <Typography variant="h6" component="span">
          {t('reports:overdueAttendance')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            component={Link}
            to={getReportUrl({
              report: Report.OVERDUE_LESSON_ATTENDANCE,
              filters: {
                from_date: fromDate,
                to_date: toDate,
              },
            })}
          >
            <FullScreenIcon
              sx={{ width: 20, height: 20, color: 'primary.main' }}
            />
          </IconButton>
        </Stack>
      </Stack>
      {isLoading || overdueAttendances.length === 0 ? (
        <Card
          sx={{
            minHeight: 160,
          }}
        >
          <LoadingPlaceholderContainer isLoading={isLoading}>
            <Stack
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h2" component="span">
                👍
              </Typography>
              <Typography
                variant="body1"
                component="span"
                color="text.secondary"
              >
                {t('reports:noOverdueAttendanceToday')}
              </Typography>
            </Stack>
          </LoadingPlaceholderContainer>
        </Card>
      ) : (
        <Stack spacing={1.25}>
          {overdueAttendances.map(
            ({ id, colour, overdueByMins, subjectGroupName, subjectName }) => (
              <Box
                key={id}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 0.75,
                  width: 240,
                  userSelect: 'none',
                }}
                role="button"
                tabIndex={0}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'stretch',
                    height: '100%',
                    p: 0.75,
                    pr: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 3,
                      borderRadius: 1.5,
                      backgroundColor: `${colour}.main`,
                      mr: 0.75,
                    }}
                  />
                  <Stack sx={{ overflow: 'hidden', flex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                        {subjectGroupName}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="span"
                        fontWeight={500}
                        color="slate.500"
                      >
                        {/* TODO: replace with real value */}
                        rm. 201
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Chip
                        size="small"
                        variant="soft"
                        color={colour}
                        label={subjectName}
                        sx={{
                          borderRadius: 0.75,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Chip
                        size="small"
                        variant="soft"
                        color="rose"
                        label={overdueByMins}
                        sx={{
                          borderRadius: 0.75,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )
          )}
        </Stack>
      )}
    </Card>
  );
}
