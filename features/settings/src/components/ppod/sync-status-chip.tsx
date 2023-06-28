import { Chip, ChipProps } from '@mui/material';
import { SyncRequestStatus } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface SyncStatusChipProps {
  status: SyncRequestStatus;
}

const syncStatusColorMapping: Record<SyncRequestStatus, ChipProps['color']> = {
  [SyncRequestStatus.InProgress]: 'info',
  [SyncRequestStatus.Fail]: 'error',
  [SyncRequestStatus.Error]: 'error',
  [SyncRequestStatus.Success]: 'success',
};

export function SyncStatusChip({ status }: SyncStatusChipProps) {
  const { t } = useTranslation(['settings']);

  if (!status) {
    return <span>-</span>;
  }

  return (
    <Chip
      label={t(`settings:ppodSyncStatus.${status}`)}
      variant="soft"
      color={syncStatusColorMapping[status]}
    />
  );
}
