import { Card, Stack, Typography, Divider, Box } from '@mui/material';
import {
  Avatar,
  CopyClipboardButton,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useCustomGroupDefinition } from '../../api';

interface CustomGroupStatusBarProps {
  partyId: number;
}

export function CustomGroupStatusBar({ partyId }: CustomGroupStatusBarProps) {
  const { t } = useTranslation(['common', 'groups']);
  const { displayNames } = usePreferredNameLayout();

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'slate.600',
  };

  const textValueStyle = {
    fontSize: '0.75rem',
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box p={1}>
              <Avatar
                src={customGroupData?.name}
                name={customGroupData?.name}
              />
            </Box>
            <Typography variant="subtitle1" component="h2">
              {customGroupData?.name}
            </Typography>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {[
            {
              label: t('common:members'),
              value: customGroupData?.memberCount ?? '-',
            },
            {
              label: t('groups:organisersInGroup'),
              value: displayNames(customGroupData?.organisers) || '-',
            },
          ].map(({ label, value }) => (
            <Stack key={label} direction="column">
              <Typography
                component="dt"
                variant="body1"
                sx={{
                  ...labelStyle,
                  py: 0.5,
                  mb: 0.5,
                }}
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                sx={{
                  ...textValueStyle,
                  py: 0.5,
                }}
              >
                {value}
              </Typography>
            </Stack>
          ))}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Stack direction="column">
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                px: 1,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('common:tyroId')}
            </Typography>
            <CopyClipboardButton
              aria-label={t('common:tyroIdClickToCopy', { id: partyId })}
              textToCopy={String(partyId)}
              successMessage={t('common:tyroIdCopied')}
              errorMessage={t('common:issueCopyingTyroId')}
            />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
