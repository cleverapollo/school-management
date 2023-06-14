import { Chip, ChipProps } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface AttendanceCodeChipProps {
  codeType: AttendanceCodeType;
}

const codeTypeColorMapping: Record<
  AttendanceCodeChipProps['codeType'],
  ChipProps['color']
> = {
  [AttendanceCodeType.Present]: 'success',
  [AttendanceCodeType.ExplainedAbsence]: 'error',
  [AttendanceCodeType.UnexplainedAbsence]: 'error',
  [AttendanceCodeType.Late]: 'info',
  [AttendanceCodeType.NotTaken]: 'default',
};

export function AttendanceCodeChip({ codeType }: AttendanceCodeChipProps) {
  const { t } = useTranslation(['common']);
  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={t(`common:attendanceCode.${codeType}`)}
      variant="soft"
      color={codeTypeColorMapping[codeType]}
    />
  );
}
