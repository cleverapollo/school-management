import { Chip, ChipProps } from '@mui/material';
import { SubjectGroupLevelIrePp } from '@tyro/api';
import { capitalize } from 'lodash';

interface SubjectGroupLevelChipProps {
  level: SubjectGroupLevelIrePp;
}

const subjectGroupMapColor: Record<SubjectGroupLevelIrePp, ChipProps['color']> =
  {
    [SubjectGroupLevelIrePp.NotApplicable]: 'default',
    [SubjectGroupLevelIrePp.Higher]: 'error',
    [SubjectGroupLevelIrePp.Ordinary]: 'info',
    [SubjectGroupLevelIrePp.Common]: 'warning',
    // TODO: uncomment it when grapqhl scheme gets updated
    // [SubjectGroupLevelIrePp.Foundation]: 'success',
  };

export function SubjectGroupLevelChip({ level }: SubjectGroupLevelChipProps) {
  if (level === SubjectGroupLevelIrePp.NotApplicable) {
    return <span>-</span>;
  }

  return (
    <Chip
      sx={{ pointerEvents: 'none' }}
      label={capitalize(level)}
      variant="soft"
      color={subjectGroupMapColor[level]}
    />
  );
}
