import { Chip } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { getColourBasedOnAttendanceType } from '../../../utils/get-colors-based-on-attendance-type';

interface AttendanceCodeChipProps {
  codeType: AttendanceCodeType;
}

export function AttendanceCodeChip({ codeType }: AttendanceCodeChipProps) {
  const { t } = useTranslation(['common']);

  return (
    <Chip
      sx={() => ({
        pointerEvents: 'none',
        color: getColourBasedOnAttendanceType(codeType).colour,
        backgroundColor:
          getColourBasedOnAttendanceType(codeType).backGroundColor,
      })}
      label={t(`common:attendanceCode.${codeType}`)}
      variant="soft"
    />
  );
}
