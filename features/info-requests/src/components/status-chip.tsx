import { RequestStatus } from '@tyro/api';
import { Chip, ChipProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

interface InfoRequestChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: RequestStatus;
}

const requestStatusColor = {
  [RequestStatus.Complete]: 'emerald',
  [RequestStatus.Incomplete]: 'red',
  [RequestStatus.PartiallyComplete]: 'blue',
} as const;

export function InfoRequestStatusChip({
  status,
  ...props
}: InfoRequestChipProps) {
  const { t } = useTranslation(['infoRequests']);

  return (
    <Chip
      size="small"
      variant="soft"
      color={requestStatusColor[status]}
      label={t(`infoRequests:status.${status}`)}
      {...props}
    />
  );
}
