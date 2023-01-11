// @mui
import { styled } from '@mui/material/styles';
import {Box, Card, Avatar, Divider, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import cssStyles from '../../../utils/cssStyles';
// @types
// components
import Image from '../../../components/Image';
import SvgIconStyle from '../../../components/SvgIconStyle';
import { Profile } from '@tyro/api';
import { useMutateActiveProfile } from '../api/active-profile';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

type Props = {
  profile: Profile
};

export default function ProfileCard({ profile }: Props) {
  const { mutateAsync, isLoading } = useMutateActiveProfile();

  const activateProfile = () => {
    mutateAsync(profile.id);
  }

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={profile.tenant.name}
          src={profile.tenant.imgUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <OverlayStyle />
        <Image src={profile.tenant.imgUrl} alt={profile.tenant.name} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6 }}>
        {profile.nickName}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', my: 2.5 }}>
        {profile.tenant?.name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', my: 2.5 }}>
        {profile.profileType?.name}
      </Typography>

      <Stack alignItems="center" />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
        <LoadingButton variant="contained" loading={isLoading} onClick={activateProfile}>Activate</LoadingButton>
      </Box>
    </Card>
  );
}
