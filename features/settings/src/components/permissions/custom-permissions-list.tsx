import { useTranslation } from '@tyro/i18n';
import { Typography, Grid, Box, Button, Stack } from '@mui/material';
import { PlaceholderCard, Link as CoreLink } from '@tyro/core';
import { Link } from 'react-router-dom';
import { EditPenCheckmark } from '@tyro/icons';
import { usePermissionGroups } from '../../api/permissions/user-permissions-groups';
import { PermissionGroupCard } from './permission-group-card';

export const CustomPermissionsList = () => {
  const { t } = useTranslation(['settings', 'common']);
  const { data: permissionsData = [] } = usePermissionGroups({ custom: true });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Typography component="h3" variant="subtitle1" color="text.secondary">
            {t('settings:permissions.customPermissionsGroups')}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="./create"
            startIcon={<EditPenCheckmark />}
          >
            {t('settings:permissions.createNewGroup')}
          </Button>
        </Stack>
      </Grid>

      {permissionsData.length > 0 ? (
        permissionsData?.map((permission) => (
          <Grid key={permission?.id} item xs={12} sm={6} md={4}>
            <PermissionGroupCard {...permission} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <PlaceholderCard cardProps={{ sx: { boxShadow: 'none', p: 0 } }}>
            <Box>
              <Typography component="h4" variant="subtitle1">
                {t('settings:permissions.emptyCustomPermissionsGroups')}
              </Typography>
              <CoreLink variant="body2" to="./create">
                {t('settings:permissions.createNewGroup')}
              </CoreLink>
            </Box>
          </PlaceholderCard>
        </Grid>
      )}
    </Grid>
  );
};
