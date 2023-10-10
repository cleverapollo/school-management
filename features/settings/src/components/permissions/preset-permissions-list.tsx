import { useTranslation } from '@tyro/i18n';
import {
  PersonCircleIcon,
  BooksAppleIcon,
  OfficeDeskIcon,
  HandHeartIcon,
} from '@tyro/icons';
import { Typography, Grid } from '@mui/material';
import { ReactNode } from 'react';
import { MemberType } from '@tyro/api';
import { usePermissionGroups } from '../../api/permissions/user-permissions-groups';
import { PermissionGroupCard } from './permission-group-card';

const Icons: Record<MemberType, ReactNode> = {
  [MemberType.Student]: <PersonCircleIcon />,
  [MemberType.Staff]: <BooksAppleIcon />,
  [MemberType.Admin]: <OfficeDeskIcon />,
  [MemberType.Contact]: <HandHeartIcon />,
  [MemberType.External]: <OfficeDeskIcon />, // May never be used
  [MemberType.ThirdParty]: <OfficeDeskIcon />,
};

export const PresetPermissionsList = () => {
  const { t } = useTranslation(['settings']);
  const { data: permissionsData = [] } = usePermissionGroups({ custom: false });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h3" variant="subtitle1" color="text.secondary">
          {t('settings:permissions.presetPermissionsOptions')}
        </Typography>
      </Grid>

      {permissionsData.map(
        (permission) =>
          permission && (
            <Grid item xs={12} sm={6} key={permission?.id}>
              <PermissionGroupCard
                {...permission}
                icon={Icons[permission.memberType]}
              />
            </Grid>
          )
      )}
    </Grid>
  );
};
