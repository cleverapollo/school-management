import { Chip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export enum RotationStatus {
  Complete = 'COMPLETE',
  Active = 'ACTIVE',
  Next = 'NEXT',
  Future = 'FUTURE',
}

const statusStyles = {
  [RotationStatus.Complete]: {
    color: 'green.600',
    backgroundColor: 'green.100',
  },
  [RotationStatus.Active]: {
    color: 'indigo.600',
    border: '1px solid',
    borderColor: 'indigo.600',
    backgroundColor: 'transparent',
  },
  [RotationStatus.Next]: {
    color: 'indigo.500',
    backgroundColor: 'indigo.100',
  },
  [RotationStatus.Future]: {
    color: 'slate.500',
    backgroundColor: 'slate.100',
  },
};

type RotationStatusIconProps = {
  status: RotationStatus;
};

export const RotationStatusChip = ({ status }: RotationStatusIconProps) => {
  const { t } = useTranslation(['classListManager']);

  return (
    <Chip
      label={t(`classListManager:rotationStatus.${status}`)}
      variant="soft"
      size="small"
      sx={{
        ...statusStyles[status],
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
};
