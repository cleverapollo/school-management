import { Badge, IconButton } from '@mui/material';
import { MailIcon } from '@tyro/icons';
import { useUser } from '@tyro/api';
import { Link } from 'react-router-dom';
import { useUnreadCount } from '../api/labels';

export function MailLinkWithCount() {
  const { activeProfile } = useUser();

  const { data: unreadCountData } = useUnreadCount(
    activeProfile?.partyId
      ? {
          personPartyId: activeProfile?.partyId,
        }
      : null
  );

  return (
    <IconButton component={Link} to="/mail" sx={{ width: 40, height: 40 }}>
      <Badge
        badgeContent={unreadCountData?.totalUnreadCount ?? 0}
        color="error"
        sx={{
          '& .MuiBadge-badge': { minWidth: 16, height: 16, padding: '0 4px' },
        }}
        overlap="circular"
      >
        <MailIcon />
      </Badge>
    </IconButton>
  );
}
