import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { TyroId } from '../../common/tyro-id';
import { useContactPersonal } from '../../../api/contact/personal';

interface ContactOverviewBarProps {
  contactId: number | undefined;
}

export function ContactOverviewBar({ contactId }: ContactOverviewBarProps) {
  const { displayName } = usePreferredNameLayout();

  const { data: contactData } = useContactPersonal(contactId);

  const name = displayName(contactData?.person);

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <Avatar
            name={name}
            src={contactData?.person?.avatarUrl}
            person={contactData?.person}
            size={78}
            sx={{ mr: 1 }}
          />
          <Stack sx={{ ml: 0.5, mr: 2.5 }}>
            <Typography variant="subtitle1" component="h2">
              {name}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TyroId id={contactData?.partyId ?? 0} />
        </Stack>
      </Card>
    </Box>
  );
}
