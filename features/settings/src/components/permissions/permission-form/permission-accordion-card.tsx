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
import { PropsWithChildren, useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { PermissionFormState } from './types';

type PermissionAccordionCardProps = PropsWithChildren<{
  feature: Feature;
  control: Control<PermissionFormState>;
  totalPermissions: number;
}>;

export const PermissionAccordionCard = ({
  feature,
  control,
  totalPermissions,
  children,
}: PermissionAccordionCardProps) => {
  const { t } = useTranslation(['common', 'settings']);

  const permissionsFieldsBySetId = useWatch({
    control,
    name: 'permissionsFieldsBySetId',
  });

  const enabledPermissions = useMemo(
    () =>
      Object.values(permissionsFieldsBySetId || {}).filter(
        (permission) =>
          permission.feature === feature &&
          (permission.toggle || permission.permissionType)
      ),
    [permissionsFieldsBySetId]
  );

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
                  color={enabledPermissions ? 'text.primary' : 'text.disabled'}
                >
                  {`${enabledPermissions.length}/${totalPermissions}`}
                </Typography>
              </Paper>
            </Box>
          }
          aria-controls={feature}
          id={feature}
        >
          <Typography component="h3" variant="subtitle2">
            {t(`settings:permissions.features.${feature}`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
};
