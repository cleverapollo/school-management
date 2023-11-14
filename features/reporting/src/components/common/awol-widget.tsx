import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import {
  LoadingPlaceholderContainer,
  usePreferredNameLayout,
} from '@tyro/core';
import { StudentAvatar } from '@tyro/people';
import { Fragment, useMemo } from 'react';
import { useAttendanceAwolReports } from '../../api/awol-report';

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
        <IconButton component={Link} to="/reports/awol-students">
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      <Card
        sx={{
          minHeight: 160,
          p: isLoading || sortedAwolStudents.length === 0 ? 0 : 1.5,
        }}
      >
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {sortedAwolStudents.length === 0 ? (
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
              <Box px={0.5} role="columnheader">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="span"
                >
                  {t('common:student')}
                </Typography>
              </Box>
              <Box role="columnheader">
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
                  presentSubjectGroup,
                  presentEvent,
                } = awolStudent;
                const { yearGroups, person } = student ?? {};
                const presentSubjectGroupColour =
                  presentSubjectGroup?.subjects?.[0]?.colour ?? 'slate';
                const yearName = yearGroups?.[0]?.name;
                const name = displayName(person);
                const previousRoom = presentEvent?.rooms?.[0]?.name;

                return (
                  <Fragment key={partyId}>
                    <Box
                      py={1}
                      px={1}
                      bgcolor="slate.100"
                      borderRadius="12px 0 0 12px"
                      role="gridcell"
                      display="flex"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1}>
                        <StudentAvatar
                          partyId={partyId}
                          name={name}
                          src={student?.person?.avatarUrl}
                          isPriorityStudent={!!student?.extensions?.priority}
                          hasSupportPlan={false}
                          size={36}
                        />
                        <Stack>
                          <Typography variant="subtitle2" component="span">
                            {name}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.secondary"
                            component="span"
                          >
                            {yearName}{' '}
                            <Box component="span" ml={0.5}>
                              {classGroup?.name}
                            </Box>
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <Box
                      py={1}
                      pr={1}
                      bgcolor="slate.100"
                      borderRadius="0 12px 12px 0"
                      role="gridcell"
                      display="flex"
                      alignItems="center"
                    >
                      <Box
                        bgcolor="white"
                        border="1px solid"
                        borderColor="indigo.100"
                        borderRadius="8px"
                        flex={1}
                      >
                        <Stack direction="row" alignItems="stretch" p={0.5}>
                          <Box
                            bgcolor={`${presentSubjectGroupColour}.400`}
                            sx={{
                              width: 5,
                              borderRadius: 2.5,
                              mr: 0.75,
                            }}
                          />
                          <Typography variant="subtitle2" component="span">
                            {presentEvent?.name}
                          </Typography>
                          {previousRoom && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              component="span"
                              ml={1}
                              lineHeight="22px"
                            >
                              {previousRoom}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
          )}
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
