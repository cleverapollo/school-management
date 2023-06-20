import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryProps,
  Box,
  Card,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ChevronDownIcon } from '@tyro/icons';
import { PropsWithChildren } from 'react';

type PermissionAccordionCardProps = PropsWithChildren<{
  name: string;
  description?: string;
  totalPermissions: number;
  permissionsEnabled: number;
}>;

export const PermissionAccordionCard = ({
  name,
  description,
  totalPermissions,
  permissionsEnabled,
  children,
}: PermissionAccordionCardProps) => {
  const { t } = useTranslation(['settings', 'common']);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Accordion sx={{ p: 2 }}>
        <AccordionSummary
          sx={{
            alignItems: 'start',
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
          aria-controls={name}
          id={name}
        >
          <Stack>
            <Typography component="h3" variant="subtitle2">
              {name}
            </Typography>
            <Typography variant="body2" component="p" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
};
