import { Chip, ChipProps } from '@mui/material';
import { SubjectGroupLevelIrePp } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

interface SubjectGroupLevelChipProps {
  level: SubjectGroupLevelIrePp;
}

const subjectGroupMapColor: Record<SubjectGroupLevelIrePp, ChipProps['color']> =
  {
    [SubjectGroupLevelIrePp.NotApplicable]: 'default',
    [SubjectGroupLevelIrePp.Higher]: 'error',
    [SubjectGroupLevelIrePp.Ordinary]: 'info',
    [SubjectGroupLevelIrePp.Common]: 'warning',
    [SubjectGroupLevelIrePp.Foundation]: 'success',
  };

export function SubjectGroupLevelChip({ level }: SubjectGroupLevelChipProps) {
  const { t } = useTranslation(['groups']);

  if (level === SubjectGroupLevelIrePp.NotApplicable) {
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
