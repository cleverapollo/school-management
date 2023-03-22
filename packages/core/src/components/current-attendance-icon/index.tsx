import { Box, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AttendanceCodeType } from '@tyro/api';
import { CheckmarkIcon, CloseIcon, MinusIcon } from '@tyro/icons';

interface CurrentAttendanceIconProps {
  tooltipText?: string;
  codeType?: AttendanceCodeType;
}

function getCodeTypeIconSettings(codeType?: AttendanceCodeType): {
  icon: JSX.Element;
  color: 'green' | 'rose' | 'blue';
} {
  switch (codeType) {
    case AttendanceCodeType.Present:
    case AttendanceCodeType.Late:
      return {
        icon: <CheckmarkIcon sx={{ color: 'white', width: 16, height: 16 }} />,
        color: 'green',
      };
    case AttendanceCodeType.UnexplainedAbsence:
    case AttendanceCodeType.ExplainedAbsence:
      return {
        icon: <CloseIcon sx={{ color: 'white', width: 16, height: 16 }} />,
        color: 'rose',
      };
    case AttendanceCodeType.NotTaken:
    default:
      return {
        icon: <MinusIcon sx={{ color: 'white', width: 16, height: 16 }} />,
        color: 'blue',
      };
  }
}

export function CurrentAttendanceIcon({
  tooltipText,
  codeType,
}: CurrentAttendanceIconProps) {
  const { icon, color } = getCodeTypeIconSettings(codeType);

  return (
    <Tooltip title={tooltipText}>
      <Box
        sx={({ palette }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(palette[color]['500'], 0.35),
          width: 26,
          height: 26,
          borderRadius: '50%',
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}.500`,
            width: 20,
            height: 20,
            borderRadius: '50%',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Tooltip>
  );
}
