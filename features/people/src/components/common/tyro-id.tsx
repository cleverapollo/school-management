import { useTranslation } from '@tyro/i18n';
import { Box, Stack } from '@mui/material';
import { CopyClipboardButton } from '@tyro/core';

interface TyroIdProps {
  id: number;
}

export function TyroId({ id }: TyroIdProps) {
  const { t } = useTranslation(['common']);

  return (
    <Stack>
      <Box
        component="dt"
        sx={{
          fontSize: '0.75rem',
          px: 2,
          color: 'slate.600',
          lineHeight: 34 / 12,
        }}
      >
        {t('common:tyroId')}
      </Box>
      <Box
        sx={{
          px: 1,
          my: 0.25,
        }}
      >
        <CopyClipboardButton
          aria-label={t('common:tyroIdClickToCopy', { id })}
          textToCopy={String(id)}
          successMessage={t('common:tyroIdCopied')}
          errorMessage={t('common:issueCopyingTyroId')}
        />
      </Box>
    </Stack>
  );
}
