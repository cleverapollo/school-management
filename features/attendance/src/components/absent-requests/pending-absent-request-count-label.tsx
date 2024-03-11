import { Chip } from '@mui/material';
import { usePendingAbsentRequestCount } from '../../api/absent-requests';

export function PendingAbsentRequestCountLabel() {
  const { data: pendingAbsentRequestCount } = usePendingAbsentRequestCount();

  if (!pendingAbsentRequestCount) return null;

  return (
    <Chip
      label={pendingAbsentRequestCount}
      size="small"
      variant="soft"
      color="error"
      sx={{
        borderRadius: 0.75,
      }}
    />
  );
}
