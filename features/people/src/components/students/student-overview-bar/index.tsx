import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { PreferredNameFormat, usePreferredNameLayout } from '@tyro/core';
import { useStudent } from '../../../api/student/students';
import { AdditionalInfo } from './additional-info';
import { CurrentLocation } from './current-location';
import { TyroId } from '../../common/tyro-id';
import { usePersonStatus } from '../../../api/person/status';
import { StudentAvatar } from '../../common/student-avatar';

interface StudentOverviewBarProps {
  studentId: number | undefined;
}

export function StudentOverviewBar({ studentId }: StudentOverviewBarProps) {
  const { displayName } = usePreferredNameLayout();

  const { data: studentData } = useStudent(studentId);
  const { data: statusData } = usePersonStatus(studentId);

  const name = displayName(studentData?.person, {
    format: PreferredNameFormat.FirstnameSurname,
  });

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <StudentAvatar
            partyId={studentData?.partyId ?? 0}
            name={name}
            src={studentData?.person?.avatarUrl}
            ContainingButtonProps={{
              sx: {
                m: 1,
              },
            }}
            isPriorityStudent={!!studentData?.extensions?.priority}
            hasSupportPlan={false}
            size={62}
          />
          <Stack sx={{ ml: 0.5, mr: 2.5 }}>
            <Typography variant="subtitle1" component="h2">
              {name}
            </Typography>

            {Array.isArray(statusData?.sessionAttendance) && (
              <Stack component="dl" sx={{ my: 0 }}>
                {statusData?.sessionAttendance?.map((session) => (
                  <Stack key={session?.name} direction="row" spacing={1}>
                    <Typography
                      component="dt"
                      sx={{
                        color: 'slate.600',
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {session?.name}
                    </Typography>
                    <Typography component="dd" sx={{ fontSize: 12 }}>
                      {session?.status ?? '-'}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
          <CurrentLocation studentPartyId={studentData?.partyId} />
          <Divider orientation="vertical" flexItem sx={{ ml: 2.5, mr: 1 }} />
          <AdditionalInfo
            years={studentData?.yearGroups ?? []}
            classGroup={studentData?.classGroup}
            tutors={studentData?.tutors ?? []}
            yearGroupLeads={studentData?.yearGroupLeads ?? []}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TyroId id={studentData?.partyId ?? 0} />
        </Stack>
      </Card>
    </Box>
  );
}
