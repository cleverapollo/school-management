import { Chip, ChipProps, Typography } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';

interface TabChipAttendanceProps {
  codeType: AttendanceCodeType | string;
  value: number;
  label: string;
}

const codeTypeColorMapping: Record<
  TabChipAttendanceProps['codeType'],
  ChipProps['color']
> = {
  ALL: 'primary',
  [AttendanceCodeType.Present]: 'success',
  [AttendanceCodeType.ExplainedAbsence]: 'error',
  [AttendanceCodeType.UnexplainedAbsence]: 'error',
  [AttendanceCodeType.Late]: 'info',
  [AttendanceCodeType.NotTaken]: 'default',
};

export function TabChipAttendance({
  codeType,
  value,
  label,
}: TabChipAttendanceProps) {
  return (
    <>
      <Chip
        sx={{ pointerEvents: 'none', mr: 1, height: 20 }}
        label={<Typography variant="overline">{value}</Typography>}
        variant="soft"
        color={codeTypeColorMapping[codeType]}
      />
      <Typography variant="subtitle2">{label}</Typography>
    </>
  );
}
