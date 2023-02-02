import { useTranslation } from '@tyro/i18n';
import { Box, Button, Stack } from '@mui/material';
import { CopyIcon } from '@tyro/icons';
import { useCopyToClipboard } from 'react-use';
import { useEffect } from 'react';
import { useToast } from '@tyro/core';

interface TyroIdProps {
  id: number;
}

export function TyroId({ id }: TyroIdProps) {
  const { t } = useTranslation(['people']);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast(t('people:issueCopyingTyroId'), { variant: 'error' });
    } else if (state.value) {
      toast(t('people:tyroIdCopied'));
    }
  }, [state]);

  return (
    <Stack spacing={0.25}>
      <Box
        component="dt"
        sx={{
          fontSize: '0.75rem',
          px: 2,
          color: 'slate.600',
          lineHeight: 34 / 12,
        }}
      >
        {t('people:tyroId')}
      </Box>
      <Box
        sx={{
          px: 1,
        }}
      >
        <Button
          size="small"
          sx={{
            fontSize: '0.75rem',
            justifyContent: 'flex-start',
            minWidth: 'auto',
            px: 1,
            '& .MuiButton-endIcon': {
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
            },
            '&:hover .MuiButton-endIcon': {
              opacity: 1,
            },
          }}
          aria-label={t('people:tyroIdClickToCopy', { id })}
          onClick={() => copyToClipboard(String(id))}
          endIcon={<CopyIcon fontSize="inherit" />}
        >
          {id}
        </Button>
      </Box>
    </Stack>
  );
}
