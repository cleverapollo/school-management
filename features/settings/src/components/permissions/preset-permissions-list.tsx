import { useTranslation } from '@tyro/i18n';
import {
  PersonCircleIcon,
  BooksAppleIcon,
  OfficeDeskIcon,
  HandHeartIcon,
} from '@tyro/icons';
import { Typography, Grid } from '@mui/material';
import { ReactNode } from 'react';
import { MemberType, PermissionGroup } from '@tyro/api';
import {
  PresetIconName,
  usePermissionGroups,
} from '../../api/permissions/user-permissions-groups';
import { PermissionGroupCard } from './permission-group-card';

const Icons: Record<PresetIconName, ReactNode> = {
  [PresetIconName.Student]: <PersonCircleIcon />,
  [PresetIconName.Teacher]: <BooksAppleIcon />,
  [PresetIconName.Admin]: <OfficeDeskIcon />,
  [PresetIconName.Contact]: <HandHeartIcon />,
};

const mockedPermissions: (PermissionGroup & {
  presetIconName?: PresetIconName;
})[] = [
  {
    id: 1,
    name: 'Student',
    description: 'Personal Only',
    memberPartyIds: Array.from({ length: 376 }, (_v, k) => k + 1),
    memberType: MemberType.Student,
    presetIconName: PresetIconName.Student,
  },
  {
    id: 2,
    name: 'Teacher',
    description: 'Personal, owned groups and more',
    memberPartyIds: Array.from({ length: 28 }, (_v, k) => k + 1),
    memberType: MemberType.Staff,
    presetIconName: PresetIconName.Teacher,
  },
  {
    id: 3,
    name: 'Admin',
    description: 'Complete Tyro System Access',
    memberPartyIds: Array.from({ length: 3 }, (_v, k) => k + 1),
    memberType: MemberType.Staff,
    presetIconName: PresetIconName.Admin,
  },
  {
    id: 3,
    name: 'Contact',
    description: 'Related Student info and more',
    memberPartyIds: Array.from({ length: 459 }, (_v, k) => k + 1),
    memberType: MemberType.Staff,
    presetIconName: PresetIconName.Contact,
  },
];

export const PresetPermissionsList = () => {
  const { t } = useTranslation(['settings']);
  const { data: permissionsData } = usePermissionGroups({ custom: false });

  const tempData = [...mockedPermissions, ...(permissionsData || [])];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h3" variant="subtitle1" color="text.secondary">
          {t('settings:permissions.presetPermissionsOptions')}
        </Typography>
      </Grid>

      {tempData.map(
        (permission) =>
          permission && (
            <Grid item xs={12} sm={6}>
              <PermissionGroupCard
                key={permission?.id}
                {...permission}
                // @ts-expect-error
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                icon={Icons[permission.presetIconName]}
              />
            </Grid>
          )
      )}
    </Grid>
  );
};
