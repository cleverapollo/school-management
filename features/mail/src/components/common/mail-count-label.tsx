import { Chip } from '@mui/material';
import { queryClient } from '@tyro/api';
import { useEffect } from 'react';
import { mailKeys } from '../../api/keys';
import { useUnreadCount } from '../../api/labels';
import { useMailSettings } from '../../store/mail-settings';

export function MailCountLabel() {
  const { activeProfileId } = useMailSettings();

  const { data: unreadCountData } = useUnreadCount({
    personPartyId: activeProfileId,
  });
  const count = unreadCountData?.get('inbox') ?? 0;

  useEffect(() => {
    queryClient.invalidateQueries(mailKeys.lists());
  }, [count]);

  if (!count) return null;

  return (
    <Chip
      label={count}
      size="small"
      variant="soft"
      color="error"
      sx={{
        borderRadius: 0.75,
      }}
    />
  );
}
