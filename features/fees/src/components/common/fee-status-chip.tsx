import { FeeStatus } from '@tyro/api';
import { Chip, ChipProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

interface FeeStatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: FeeStatus;
}

const feeStatusColor = {
  [FeeStatus.Complete]: 'emerald',
  [FeeStatus.Overdue]: 'red',
  [FeeStatus.Outstanding]: 'blue',
} as const;

export function FeeStatusChip({ status, ...props }: FeeStatusChipProps) {
  const { t } = useTranslation(['fees']);

  return (
    <Chip
      size="small"
      variant="soft"
      color={feeStatusColor[status]}
      label={t(`fees:status.${status}`)}
      {...props}
    />
  );
}
