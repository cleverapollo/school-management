import {
  Card,
  IconButton,
  Stack,
  Typography,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FullScreenIcon, ClockIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import {
  LoadingPlaceholderContainer,
  getNumber,
  getHumanizedTime,
} from '@tyro/core';
import { Colour, useUser } from '@tyro/api';
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
  calendar_room_name: ReportColumnValue;
}[];

export function OverdueAttendanceWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const { user } = useUser();
  const partyId = getNumber(user?.profiles?.[0]?.partyId);
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
        {
          filterId: 'staff',
          filterValue: partyId ? [partyId] : [],
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
      calendarRoomName: overdueAttendance.calendar_room_name?.value,
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
                staff: partyId ? [partyId] : [],
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
        <Grid container rowGap={1.45} columnSpacing={1.25}>
          {overdueAttendances.map(
            ({
              id,
              colour,
              overdueByMins,
              subjectGroupName,
              subjectName,
              calendarRoomName,
            }) => (
              <Grid key={id} xs={6}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    userSelect: 'none',
                    boxShadow: (theme) =>
                      `0 1px 6px 0px ${alpha(theme.palette.indigo[500], 0.1)}`,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: 'stretch',
                      height: '100%',
                      py: 1.75,
                      pl: 1.5,
                      pr: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        borderRadius: 3,
                        backgroundColor: `${colour}.main`,
                        mr: 0.75,
                      }}
                    />
                    <Stack flex={1} sx={{ maxWidth: 'calc(100% - 12px)' }}>
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
                          {t('reports:roomX', { name: calendarRoomName })}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Stack maxWidth="50%">
                          <Chip
                            size="small"
                            variant="soft"
                            color={colour}
                            label={subjectName}
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Stack>
                        <Stack>
                          <Chip
                            size="small"
                            variant="soft"
                            color="rose"
                            icon={
                              <ClockIcon
                                sx={{ transform: 'rotateY(180deg)' }}
                              />
                            }
                            label={getHumanizedTime(parseInt(overdueByMins))}
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      )}
    </Card>
  );
}
