import {
  Box,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, useDisclosure, usePreferredNameLayout } from '@tyro/core';
import { SupportPlanRing } from '../../students/support-plan-ring';
import { CurrentLocation } from './current-location';
import { TyroId } from '../../common/tyro-id';
import { useStaff } from '../../../api';

interface StaffOverviewBarProps {
  staffId: number | undefined;
}

export function StaffOverviewBar({ staffId }: StaffOverviewBarProps) {
  const { t } = useTranslation(['people']);

  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const { displayName } = usePreferredNameLayout();

  const { data } = useStaff({ partyIds: [staffId ?? 0] });
  const staffData = Array.isArray(data) && data.length > 0 ? data[0] : null;


  const name = displayName(staffData?.person);

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <Avatar sx={{ mx: 1 }} src={staffData?.person?.avatarUrl} name={name} />
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
