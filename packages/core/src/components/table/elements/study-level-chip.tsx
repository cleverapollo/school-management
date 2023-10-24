import { Chip, ChipProps } from '@mui/material';
import { StudyLevel } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface TableStudyLevelChipProps extends ChipProps {
  level: StudyLevel;
  condensed?: boolean;
}

const studyLevelColorMapping: Record<StudyLevel, ChipProps['color']> = {
  [StudyLevel.NotApplicable]: 'default',
  [StudyLevel.Higher]: 'error',
  [StudyLevel.Ordinary]: 'info',
  [StudyLevel.Common]: 'warning',
  [StudyLevel.Foundation]: 'success',
};

export function TableStudyLevelChip({
  level,
  condensed,
  ...props
}: TableStudyLevelChipProps) {
  const { t } = useTranslation(['common']);

  if (level === StudyLevel.NotApplicable) {
    return <span>-</span>;
  }

  const label = condensed
    ? t(`common:studyLevel.${level}`)[0]
    : t(`common:studyLevel.${level}`);

  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={label}
      variant="soft"
      color={studyLevelColorMapping[level]}
      {...props}
    />
  );
}
