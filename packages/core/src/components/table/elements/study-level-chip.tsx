import { Chip, ChipProps } from '@mui/material';
import { StudyLevel } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface TableStudyLevelChipProps {
  level: StudyLevel;
}

const studyLevelColorMapping: Record<StudyLevel, ChipProps['color']> = {
  [StudyLevel.NotApplicable]: 'default',
  [StudyLevel.Higher]: 'error',
  [StudyLevel.Ordinary]: 'info',
  [StudyLevel.Common]: 'warning',
  [StudyLevel.Foundation]: 'success',
};

export function TableStudyLevelChip({ level }: TableStudyLevelChipProps) {
  const { t } = useTranslation(['common']);

  if (level === StudyLevel.NotApplicable) {
    return <span>-</span>;
  }

  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={t(`common:studyLevel.${level}`)}
      variant="soft"
      color={studyLevelColorMapping[level]}
    />
  );
}
