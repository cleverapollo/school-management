import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Paper,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ChevronDownIcon } from '@tyro/icons';
import { Feature } from '@tyro/api';
import { PropsWithChildren } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { PermissionFormState } from './types';

type PermissionAccordionCardProps = PropsWithChildren<{
  feature: Feature;
  totalPermissions: number;
  control: Control<PermissionFormState>;
}>;

export const PermissionAccordionCard = ({
  feature,
  totalPermissions,
  children,
  control,
}: PermissionAccordionCardProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const permissionsByFeature = useWatch({
    control,
    name: `permissionSets.${feature}`,
  }) as PermissionFormState['permissionSets'][Feature];

  const permissions = permissionsByFeature || [];

  const permissionsEnabled = permissions.filter(
    (permission) => permission.toggle || permission.permissionType
  ).length;

  const title = t(`settings:permissions.features.${feature}`);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Accordion sx={{ p: 2 }}>
        <AccordionSummary
          sx={{
            alignItems: 'center',
            p: 0,
            '&.Mui-expanded .MuiAccordionSummary-content, .MuiAccordionSummary-content':
              {
                m: 0,
              },
            '&.Mui-expanded .MuiAccordionSummary-expandIconWrapper': {
              transform: 'inherit',
            },
            '&.Mui-expanded .MuiAccordionSummary-expandIconWrapper svg': {
              transform: 'rotate(180deg)',
            },
          }}
          expandIcon={
            <Box display="flex" alignItems="center" gap={1}>
              <ChevronDownIcon color="disabled" />
              <Paper
                variant="outlined"
                sx={{
                  textAlign: 'center',
                  backgroundColor: 'slate.50',
                  px: 1.5,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="600"
                  color="text.secondary"
                >
                  {t('common:enabled')}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  color={permissionsEnabled ? 'text.primary' : 'text.disabled'}
                >
                  {`${permissionsEnabled ?? 0}/${totalPermissions ?? 0}`}
                </Typography>
              </Paper>
            </Box>
          }
          aria-controls={title}
          id={feature}
        >
          <Typography component="h3" variant="subtitle2">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
};
