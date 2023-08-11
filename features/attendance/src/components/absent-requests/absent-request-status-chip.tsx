import { ParentalAttendanceRequestStatus } from '@tyro/api';
import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { Chip } from '@mui/material';

export type AbsentRequestStatusChipProps = {
  status: ParentalAttendanceRequestStatus;
};

export const AbsentRequestStatusChip = ({
  status,
}: AbsentRequestStatusChipProps) => {
  const { t } = useTranslation(['attendance']);

  const { color, backgroundColor } = useMemo(() => {
    if (status === ParentalAttendanceRequestStatus.Approved) {
      return { color: '#22C55E', backgroundColor: '#DCFCE7' };
    }
    if (status === ParentalAttendanceRequestStatus.Denied) {
      return { color: '#F43F5E', backgroundColor: '#FFE4E6' };
    }
    return { color: '#3B82F6', backgroundColor: '#DBEAFE' };
  }, [status]);

  return (
    <Chip
      label={t(`attendance:attendanceRequestStatus.${status}`)}
      sx={{ color, backgroundColor }}
    />
  );
};
