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
import { LoadingPlaceholderContainer, getHumanizedTime } from '@tyro/core';
import { SubjectGroup, useUser } from '@tyro/api';
import { useRunReports } from '../../api/run-report';
import { getReportUrl, Report } from '../../utils/get-report-url';
import { useReportFormatValues } from '../../hooks/use-report-format-values';
import { ReportChipValue } from '../types';

export function OverdueAttendanceWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const { activeProfile } = useUser();

  const toDate = dayjs();
  const fromDate = toDate.subtract(10, 'day');
  const partyId = activeProfile?.partyId;

  const { data: overdueAttendanceData, isLoading } = useRunReports({
    topReportId: Report.OVERDUE_LESSON_ATTENDANCE,
    filter: {
      reportId: Report.OVERDUE_LESSON_ATTENDANCE,
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

  const { mapField } = useReportFormatValues();

  const overdueAttendances = mapField<{
    id: number;
    overdue_by_mins: number;
    class_avatar_cell: SubjectGroup;
    event_start_datetime: string;
    subject_group_id: number;
    subject_name_1: ReportChipValue[];
    room_name: string;
    colour: string;
  }>(overdueAttendanceData, { limitData: 6 });

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
              overdue_by_mins: overdueByMins,
              class_avatar_cell: subjectGroupName,
              event_start_datetime: eventStartDatetime,
              subject_group_id: subjectGroupId,
              subject_name_1: subjectName,
              room_name: roomName,
              colour,
            }) => (
              <Grid key={id?.textValue} xs={6}>
                <Card>
                  <Box
                    component={Link}
                    to={`/groups/subject/${
                      subjectGroupId?.textValue ?? ''
                    }/attendance?eventStartTime=${
                      eventStartDatetime?.textValue ?? ''
                    }`}
                    sx={{
                      color: 'inherit',
                      backgroundColor: 'white',
                      borderRadius: 2,
                      userSelect: 'none',
                      textDecoration: 'inherit',
                      '&:hover': {
                        bgcolor: 'indigo.100',
                      },
                      '&:active': {
                        bgcolor: 'indigo.200',
                      },
                      boxShadow: (theme) =>
                        `0 1px 6px 0px ${alpha(
                          theme.palette.indigo[500],
                          0.1
                        )}`,
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
                          backgroundColor: `${colour?.textValue ?? ''}.main`,
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
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ flex: 1 }}
                          >
                            {subjectGroupName?.textValue}
                          </Typography>
                          <Typography
                            variant="caption"
                            component="span"
                            fontWeight={500}
                            color="slate.500"
                          >
                            {t('reports:roomX', {
                              name: roomName?.textValue || '-',
                            })}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Stack maxWidth="50%">
                            {subjectName?.renderedValue}
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
                              label={getHumanizedTime(
                                parseInt(overdueByMins?.textValue ?? ''),
                                t
                              )}
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
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}
    </Card>
  );
}
