import { Chip, ChipProps } from '@mui/material';
import { StudyLevel } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface SubjectGroupLevelChipProps {
  level: StudyLevel;
}

const subjectGroupMapColor: Record<StudyLevel, ChipProps['color']> = {
  [StudyLevel.NotApplicable]: 'default',
  [StudyLevel.Higher]: 'error',
  [StudyLevel.Ordinary]: 'info',
  [StudyLevel.Common]: 'warning',
  [StudyLevel.Foundation]: 'success',
};

export function SubjectGroupLevelChip({ level }: SubjectGroupLevelChipProps) {
  const { t } = useTranslation(['groups']);

  if (level === StudyLevel.NotApplicable) {
    return <span>-</span>;
  }

  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={t(`groups:subjectGroupLevel.${level}`)}
      variant="soft"
      color={subjectGroupMapColor[level]}
    />
  );
}
