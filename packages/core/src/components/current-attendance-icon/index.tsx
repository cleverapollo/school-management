import { useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AttendanceCodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CheckmarkIcon, CloseIcon, MinusIcon } from '@tyro/icons';

interface CurrentAttendanceIconProps {
  name: string | undefined;
  codeType: AttendanceCodeType | undefined;
}

type AttendanceCodeIconSettings = {
  icon: JSX.Element;
  color: 'green' | 'rose' | 'blue';
  tooltip: string | undefined;
};

export function CurrentAttendanceIcon({
  name,
  codeType,
}: CurrentAttendanceIconProps) {
  const { t } = useTranslation(['attendance']);

  const { icon, color, tooltip } = useMemo<AttendanceCodeIconSettings>(() => {
    switch (codeType) {
      case AttendanceCodeType.Present:
      case AttendanceCodeType.Late:
        return {
          icon: (
            <CheckmarkIcon sx={{ color: 'white', width: 16, height: 16 }} />
          ),
          color: 'green',
          tooltip: name,
        };
      case AttendanceCodeType.UnexplainedAbsence:
      case AttendanceCodeType.ExplainedAbsence:
        return {
          icon: <CloseIcon sx={{ color: 'white', width: 16, height: 16 }} />,
          color: 'rose',
          tooltip: name,
        };
      case AttendanceCodeType.NotTaken:
      default:
        return {
          icon: <MinusIcon sx={{ color: 'white', width: 16, height: 16 }} />,
          color: 'blue',
          tooltip: t('attendance:attendanceNotTaken'),
        };
    }
  }, [codeType, name, t]);

  return (
    <Tooltip title={tooltip}>
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
