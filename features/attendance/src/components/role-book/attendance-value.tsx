import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import {
  CheckmarkCircleWithPencilIcon,
  CheckmarkIcon,
  ClockIcon,
  ClockWithPencilIcon,
  CloseCircleWithPencilIcon,
  CloseCircleWithWarningIcon,
  CloseIcon,
} from '@tyro/icons';
import { getColourBasedOnAttendanceType } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { TinyPencilIcon } from './tiny-pencil-icon';

interface RolebookAttendanceValueProps {
  view: 'icons' | 'codes';
  attendanceCodeType: AttendanceCodeType;
  code: string;
  note?: string | null | undefined;
  includedInFilter: boolean;
}

export const iconBasedOnCodeType = {
  [AttendanceCodeType.Present]: <CheckmarkIcon />,
  [AttendanceCodeType.ExplainedAbsence]: <CloseIcon />,
  [AttendanceCodeType.Late]: <ClockIcon />,
  [AttendanceCodeType.UnexplainedAbsence]: <CloseCircleWithWarningIcon />,
} as const;

const iconWithNoteBasedOnCodeType = {
  [AttendanceCodeType.Present]: <CheckmarkCircleWithPencilIcon />,
  [AttendanceCodeType.ExplainedAbsence]: <CloseCircleWithPencilIcon />,
  [AttendanceCodeType.Late]: <ClockWithPencilIcon />,
  [AttendanceCodeType.UnexplainedAbsence]: <CloseCircleWithWarningIcon />,
} as const;

export function RolebookAttendanceValue({
  attendanceCodeType,
  view,
  code,
  note,
  includedInFilter,
}: RolebookAttendanceValueProps) {
  const { t } = useTranslation(['attendance']);
  if (attendanceCodeType === AttendanceCodeType.NotTaken) return null;

  const hasNote = !!note;

  const { color } = getColourBasedOnAttendanceType(attendanceCodeType).soft;

  if (view === 'codes') {
    return (
      <Tooltip
        title={
          hasNote && (
            <Typography variant="caption" color="inherit">
              {t('attendance:note')}: {note}
            </Typography>
          )
        }
      >
        <Box
          component="span"
          sx={{
            position: 'relative',
            color: includedInFilter ? color : 'text.disabled',
            opacity: includedInFilter ? 1 : 0.2,
            fontWeight: 'bold',
          }}
        >
          {code}
          {hasNote && (
            <TinyPencilIcon
              sx={{
                width: 10,
                height: 10,
                position: 'absolute',
                right: -10,
                top: 'calc(50% - 15px)',
              }}
            />
          )}
        </Box>
      </Tooltip>
    );
  }

  const icons = hasNote ? iconWithNoteBasedOnCodeType : iconBasedOnCodeType;
  const icon = icons[attendanceCodeType];
  return (
    <Tooltip
      title={
        <Stack>
          <Box component="span" fontWeight="bold">
            {code}
          </Box>
          {hasNote && (
            <Box component="span">
              {t('attendance:note')}: {note}
            </Box>
          )}
        </Stack>
      }
    >
      <Box
        sx={{
          color: includedInFilter ? color : 'text.disabled',
          opacity: includedInFilter ? 1 : 0.2,
          display: 'flex',
        }}
      >
        {icon}
      </Box>
    </Tooltip>
  );
}
