import { Card, CardHeader, Stack, Typography } from '@mui/material';
import { PermissionGroup } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { ReactNode } from 'react';
import { CopyIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';

type PermissionGroupCardProps = Partial<PermissionGroup> & {
  icon?: ReactNode;
};

export const PermissionGroupCard = ({
  id,
  name,
  description,
  memberPartyIds,
  icon,
}: PermissionGroupCardProps) => {
  const { t } = useTranslation(['settings', 'common']);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        avatar={icon}
        sx={{
          borderBottom: 0,
          padding: 3,
        }}
        title={
          <Typography component="h4" variant="subtitle2">
            {name}
          </Typography>
        }
        subheader={
          <Stack>
            <Typography variant="body2" component="p" color="text.secondary">
              {description}
            </Typography>
            <Typography variant="caption" component="p" color="text.disabled">
              {t('settings:permissions.membersCount', {
                count: memberPartyIds?.length,
              })}
            </Typography>
          </Stack>
        }
        action={
          <ActionMenu
            iconOnly
            buttonIcon={<VerticalDotsIcon />}
            menuItems={[
              {
                label: t('common:actions.edit'),
                icon: <EditIcon />,
                navigateTo: `./edit/${id || ''}`,
              },
              {
                label: t('common:actions.clone'),
                icon: <CopyIcon />,
                navigateTo: `./clone/${id || ''}`,
              },
              // TODO: add logic when BE supports it
              // {
              //   label: t('common:actions.remove'),
              //   icon: <TrashIcon />,
              //   onClick: console.log,
              // },
            ]}
          />
        }
      />
    </Card>
  );
};
