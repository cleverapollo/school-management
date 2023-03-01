import {
  Badge,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, useDisclosure } from '@tyro/core';
import { useStudent } from '../../../api/students';
import { SupportPlanRing } from '../support-plan-ring';
import { AdditionalInfo } from './additional-info';
import { CurrentLocation } from './current-location';
import { PrioritySupportStudentModal } from './priority-support-student-modal';
import { TyroId } from './tyro-id';
import { useStudentStatus } from '../../../api/status';

interface StudentOverviewBarProps {
  studentId: number | undefined;
}

export function StudentOverviewBar({ studentId }: StudentOverviewBarProps) {
  const { data, isLoading } = useStudent(studentId);
  const { data: statusData, isLoading: statusIsLoading } =
    useStudentStatus(studentId);
  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const { t } = useTranslation(['people']);
  const name = `${data?.person?.firstName ?? ''} ${
    data?.person?.lastName ?? ''
  }`;

  return (
    <>
      <Card variant="outlined" sx={{ p: 1.25, flex: 1, my: 2 }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <IconButton
            disabled={
              !statusData?.priorityStudent && !statusData?.activeSupportPlan
            }
            aria-label={t('people:studentClickableAvatarAria', { name })}
            {...getButtonProps()}
          >
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={({ palette }) => ({
                '& .MuiBadge-badge': {
                  boxShadow: `0 0 0 2px ${palette.background.paper}`,
                  backgroundColor: palette.blue[500],
                },
              })}
              overlap="circular"
              variant="dot"
              badgeContent={statusData?.priorityStudent ? 1 : 0}
            >
              <SupportPlanRing hasSupportPlan>
                <Avatar
                  src={data?.person?.avatarUrl ?? undefined}
                  name={name}
                />
              </SupportPlanRing>
            </Badge>
          </IconButton>
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
          <CurrentLocation studentPartyId={data?.partyId} />
          <Divider orientation="vertical" flexItem sx={{ ml: 2.5, mr: 1 }} />
          <AdditionalInfo
            year={data?.yearGroups}
            classGroup={data?.classGroup}
            tutors={data?.tutors}
            yearGroupLeads={data?.yearGroupLeads}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TyroId id={data?.partyId ?? 0} />
        </Stack>
      </Card>
      <PrioritySupportStudentModal
        studentId={data?.partyId ?? 0}
        studentName={name}
        {...getDisclosureProps()}
      />
    </>
  );
}
