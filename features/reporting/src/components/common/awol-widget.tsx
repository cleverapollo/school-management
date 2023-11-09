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
import { Fragment } from 'react';
import { useAttendanceAwolReports } from '../../api/awol-report';

export function AWOLWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const { displayName } = usePreferredNameLayout();
  const { data: awolStudents = [], isLoading } = useAttendanceAwolReports({
    to: dayjs().format('YYYY-MM-DD'),
    from: dayjs().format('YYYY-MM-DD'),
  });

  console.log({
    awolStudents,
  });

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
        mb={0.5}
      >
        <Typography variant="h6" component="span">
          {t('reports:awolStudents')}
        </Typography>
        <IconButton component={Link} to="/reports/awol-students">
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      <Card sx={{ minHeight: 128, p: 1.5 }}>
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {awolStudents.length === 0 ? (
            <span>No AWOL students</span>
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
                  Student
                </Typography>
              </Box>
              <Box role="columnheader">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="span"
                >
                  Last expected class
                </Typography>
              </Box>
              {awolStudents.map((awolStudent) => {
                const {
                  partyId,
                  student,
                  classGroup,
                  absentEvent,
                  presentSubjectGroup,
                } = awolStudent;
                const presentSubjectGroupColour =
                  presentSubjectGroup?.subjects?.[0]?.colour ?? 'slate';
                const name = displayName(student.person);

                return (
                  <Fragment key={partyId}>
                    <Box
                      py={1}
                      px={0.5}
                      bgcolor="slate.100"
                      borderRadius="12px 0 0 12px"
                      role="gridcell"
                    >
                      <StudentAvatar
                        partyId={partyId}
                        name={name}
                        src={student.person?.avatarUrl}
                        isPriorityStudent={!!student?.extensions?.priority}
                        hasSupportPlan={false}
                        size={36}
                      />
                      <Typography variant="subtitle2" component="span">
                        {name}
                      </Typography>
                    </Box>
                    <Box
                      py={1}
                      pr={1}
                      bgcolor="slate.100"
                      borderRadius="0 12px 12px 0"
                      role="gridcell"
                    >
                      <Box
                        bgcolor="white"
                        border="1px solid"
                        borderColor="indigo.100"
                        borderRadius="8px"
                      >
                        <Stack direction="row" alignItems="stretch">
                          <Box
                            bgcolor={`${presentSubjectGroupColour}.400`}
                            sx={{
                              width: 5,
                            }}
                          />
                          <Typography variant="body2" component="span">
                            {absentEvent?.name}
                          </Typography>
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
