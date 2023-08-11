import { ParentalAttendanceRequestStatus } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { Chip } from '@mui/material';

export type AbsentRequestStatusChipProps = {
  status: ParentalAttendanceRequestStatus;
};

const COLORS_BY_STATUS: Record<
  ParentalAttendanceRequestStatus,
  { color: string; backgroundColor: string }
> = {
  [ParentalAttendanceRequestStatus.Approved]: {
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
  },
  [ParentalAttendanceRequestStatus.Pending]: {
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
  },
  [ParentalAttendanceRequestStatus.Denied]: {
    color: '#F43F5E',
    backgroundColor: '#FFE4E6',
  },
};

export const AbsentRequestStatusChip = ({
  status,
}: AbsentRequestStatusChipProps) => {
  const { t } = useTranslation(['attendance']);

  const colors = COLORS_BY_STATUS[status];

  return (
    <Chip
      label={t(`attendance:attendanceRequestStatus.${status}`)}
      sx={colors}
    />
  );
};
