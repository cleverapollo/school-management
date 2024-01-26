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
  [Notes_BehaviourType.Positive]: 'green',
  [Notes_BehaviourType.Negative]: 'rose',
  [Notes_BehaviourType.Neutral]: 'blue',
};

export function BehaviourLabelChip({ behaviourType }: BehaviourLabelChipProps) {
  const { t } = useTranslation(['common']);
  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      size="small"
      label={t(`common:behaviourType.${behaviourType}`)}
      variant="soft"
      color={codeTypeColorMapping[behaviourType]}
    />
  );
}
