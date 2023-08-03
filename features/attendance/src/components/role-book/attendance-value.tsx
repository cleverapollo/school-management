import { Box, Tooltip } from '@mui/material';
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

interface RolebookAttendanceValueProps {
  view: 'icons' | 'codes';
  attendanceCodeType: AttendanceCodeType;
  code: string;
  hasNote: boolean;
}

const iconBasedOnCodeType = {
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

const colorsBasedOnCodeType = {
  [AttendanceCodeType.Present]: 'success',
  [AttendanceCodeType.ExplainedAbsence]: 'warning',
  [AttendanceCodeType.Late]: 'info',
  [AttendanceCodeType.UnexplainedAbsence]: 'error',
} as const;

export function RolebookAttendanceValue({
  attendanceCodeType,
  view,
  code,
  hasNote,
}: RolebookAttendanceValueProps) {
  if (attendanceCodeType === AttendanceCodeType.NotTaken) return null;

  const attendanceColor = colorsBasedOnCodeType[attendanceCodeType];

  if (view === 'codes') {
    return (
      <Box
        component="span"
        sx={{
          fontWeight: 'bold',
          color: `${attendanceColor}.main`,
        }}
      >
        {code}
      </Box>
    );
  }

  const icons = hasNote ? iconWithNoteBasedOnCodeType : iconBasedOnCodeType;
  const icon = icons[attendanceCodeType];

  return (
    <Tooltip title={code}>
      <Box
        sx={{
          color: `${attendanceColor}.main`,
          display: 'flex',
        }}
      >
        {icon}
      </Box>
    </Tooltip>
  );
}
