import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { Trans, useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import {
  LoadingPlaceholderContainer,
  PreferredNameFormat,
  usePreferredNameLayout,
} from '@tyro/core';
import { StudentAvatar } from '@tyro/people';
import { useMemo } from 'react';
import {
  useAttendanceAwolReports,
  ReturnTypeFromUseAttendanceAwolReports,
} from '../../api/awol-report';
import { getReportUrl, Report } from '../../utils/get-report-url';

export function AWOLWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const { displayName } = usePreferredNameLayout();
  const { data: awolStudents = [], isLoading } = useAttendanceAwolReports({
    to: dayjs().format('YYYY-MM-DD'),
    from: dayjs().format('YYYY-MM-DD'),
  });

  const sortedAwolStudents = useMemo(
    () =>
      awolStudents
        .sort(
          (a, b) =>
            dayjs(b.absentEvent.startTime).unix() -
            dayjs(a.absentEvent.startTime).unix()
        )
        .slice(0, 5),
    [awolStudents]
  );

  const getAttendanceBy = ({
    absentCreatedBy,
    absentUpdatedBy,
  }: ReturnTypeFromUseAttendanceAwolReports) => {
    if (absentUpdatedBy?.firstName && absentUpdatedBy?.lastName) {
      return `${absentUpdatedBy.firstName[0]}. ${absentUpdatedBy.lastName}`;
    }
    if (absentCreatedBy?.firstName && absentCreatedBy?.lastName) {
      return `${absentCreatedBy.firstName[0]}. ${absentCreatedBy.lastName}`;
    }
    return '-';
  };

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
          {t('reports:absentWithoutLeave')}
        </Typography>
        <IconButton
          component={Link}
          to={getReportUrl({
            report: Report.AWOL,
          })}
        >
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      {isLoading || sortedAwolStudents.length === 0 ? (
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
                🎒
              </Typography>
              <Typography
                variant="body1"
                component="span"
                color="text.secondary"
              >
                {t('reports:allStudentsAreAccountedFor')}
              </Typography>
            </Stack>
          </LoadingPlaceholderContainer>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            rowGap: 1.5,
            gridTemplateColumns: 'repeat(2, auto)',
          }}
          role="grid"
          aria-readonly="true"
        >
          <Box px={1} role="columnheader">
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="span"
            >
              {t('common:student')}
            </Typography>
          </Box>
          <Box px={1} role="columnheader" justifySelf="end">
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="span"
            >
              {t('reports:lastExpectedLocation')}
            </Typography>
          </Box>
          {sortedAwolStudents.map((awolStudent) => {
            const {
              partyId,
              student,
              classGroup,
              absentEvent,
              absentSubjectGroup,
            } = awolStudent;
            const { person } = student ?? {};
            const absentSubjectGroupColour =
              absentSubjectGroup?.subjects?.[0]?.colour ?? 'slate';
            const name = displayName(person, {
              format: PreferredNameFormat.FirstnameSurname,
            });
            const absentRoom = absentEvent?.rooms?.[0]?.name;
            const attendanceBy = getAttendanceBy(awolStudent);

            return (
              <Card
                component={Link}
                to={`/people/students/${partyId}/attendance`}
                key={partyId}
                sx={{
                  display: 'grid',
                  gridColumn: '1 / 3',
                  gridTemplateColumns: 'subgrid',
                  color: 'inherit',
                  textDecoration: 'inherit',
                  '&:hover': {
                    bgcolor: 'indigo.100',
                  },
                  '&:active': {
                    bgcolor: 'indigo.200',
                  },
                }}
              >
                <Box
                  py={1.25}
                  px={1.25}
                  role="gridcell"
                  gridColumn="1/2"
                  display="flex"
                  alignItems="center"
                >
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StudentAvatar
                        partyId={partyId}
                        name={name}
                        src={student?.person?.avatarUrl}
                        isPriorityStudent={!!student?.extensions?.priority}
                        hasSupportPlan={false}
                        size={48}
                      />
                      <Stack>
                        <Typography variant="subtitle1" component="span">
                          {name}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                          component="span"
                        >
                          {classGroup?.name}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      <Trans ns="reports" i18nKey="attendanceByStaff">
                        Attendance by{' '}
                        <Typography
                          variant="body2"
                          component="span"
                          fontWeight="600"
                          color="text.primary"
                        >
                          {/* @ts-expect-error */}
                          {{ attendanceBy }}
                        </Typography>
                      </Trans>
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  py={1.25}
                  pr={1.25}
                  role="gridcell"
                  gridColumn="2/3"
                  display="flex"
                  alignItems="center"
                  justifySelf="end"
                >
                  <Card
                    sx={{
                      borderRadius: 1,
                      pr: 1,
                      minWidth: 120,
                    }}
                  >
                    <Stack direction="row" alignItems="stretch" p={0.5}>
                      <Box
                        bgcolor={`${absentSubjectGroupColour}.400`}
                        sx={{
                          width: 5,
                          borderRadius: 2.5,
                          mr: 0.75,
                        }}
                      />
                      <Stack>
                        <Typography variant="subtitle1" component="span">
                          {absentEvent?.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {dayjs(absentEvent.startTime).format('LT')} -{' '}
                          {dayjs(absentEvent.endTime).format('LT')}
                        </Typography>
                        {absentRoom && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="span"
                          >
                            {absentRoom}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Card>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Card>
  );
}
