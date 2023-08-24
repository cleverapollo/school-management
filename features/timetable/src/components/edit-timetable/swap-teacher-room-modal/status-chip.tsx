import { Chip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';

const statusColors = {
  busy: 'error',
  free: 'success',
  partial: 'warning',
} as const;

interface StatusChipProps {
  lessons: Array<unknown | null>;
}

export function getStatus(lessons: StatusChipProps['lessons']) {
  if (lessons !== null && lessons.length === 0) {
    return 'free';
  }
  if (lessons.every((lesson) => !!lesson)) {
    return 'busy';
  }

  if (lessons.every((lesson) => !lesson)) {
    return 'free';
  }

  return 'partial';
}

export function StatusChip({ lessons }: StatusChipProps) {
  const { t } = useTranslation(['timetable']);
  const status = useMemo(() => getStatus(lessons), [lessons]);

  return (
    <Chip
      label={t(`timetable:status.${status}`)}
      variant="soft"
      color={statusColors[status]}
      size="small"
      sx={{
        borderRadius: 1,
        fontWeight: 600,
      }}
    />
  );
}
