import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { CurrentLocation } from './current-location';
import { TyroId } from '../../common/tyro-id';
import { useStaff } from '../../../api/staff';

interface StaffOverviewBarProps {
  staffId: number | undefined;
}

export function StaffOverviewBar({ staffId }: StaffOverviewBarProps) {
  const { displayName } = usePreferredNameLayout();

  const { data = [] } = useStaff({ partyIds: [staffId ?? 0] });
  const [staffData] = data;

  const name = displayName(staffData?.person);

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <Avatar
            name={name}
            src={staffData?.person?.avatarUrl}
            sx={{ mx: 1, width: 62, height: 62, fontSize: 20 }}
          />
          <Stack sx={{ ml: 0.5, mr: 2.5 }}>
            <Typography variant="subtitle1" component="h2">
              {name}
            </Typography>
          </Stack>
          <CurrentLocation staffPartyId={staffData?.partyId} />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TyroId id={staffData?.partyId ?? 0} />
        </Stack>
      </Card>
    </Box>
  );
}
