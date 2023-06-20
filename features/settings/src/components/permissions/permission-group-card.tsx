import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { PermissionGroup } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ReactNode } from 'react';

type PermissionGroupCardProps = Partial<PermissionGroup> & {
  icon?: ReactNode;
  onClick: () => void;
};

export const PermissionGroupCard = ({
  name,
  description,
  memberPartyIds,
  icon,
  onClick,
}: PermissionGroupCardProps) => {
  const { t } = useTranslation(['settings']);
  return (
    <Card variant="outlined">
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={2}>
            {icon}
            <Stack overflow="hidden">
              <Typography component="h4" variant="subtitle2">
                {name}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                noWrap
              >
                {description}
              </Typography>
              <Typography variant="caption" component="p" color="text.disabled">
                {t('settings:permissions.membersCount', {
                  count: memberPartyIds?.length,
                })}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
