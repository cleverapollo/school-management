import { Chip, ChipProps } from '@mui/material';
import { Notes_BehaviourType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface BehaviourLabelChipProps {
  behaviourType: Notes_BehaviourType;
}

const codeTypeColorMapping: Record<
  BehaviourLabelChipProps['behaviourType'],
  ChipProps['color']
> = {
  [Notes_BehaviourType.Positive]: 'success',
  [Notes_BehaviourType.Negative]: 'error',
  [Notes_BehaviourType.Neutral]: 'default',
};

export function BehaviourLabelChip({ behaviourType }: BehaviourLabelChipProps) {
  const { t } = useTranslation(['common']);
  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={t(`common:behaviourType.${behaviourType}`)}
      variant="soft"
      color={codeTypeColorMapping[behaviourType]}
    />
  );
}
