import { ComponentProps, useEffect } from 'react';
import { Button } from '@mui/material';
import { CopyIcon } from '@tyro/icons';
import { useCopyToClipboard } from 'react-use';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '../../hooks';

type CopyClipboardButtonProps = ComponentProps<typeof Button> & {
  textToCopy: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
};

export function CopyClipboardButton({
  textToCopy,
  buttonLabel,
  successMessage,
  errorMessage,
  ...buttonProps
}: CopyClipboardButtonProps) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.error) {
      toast(errorMessage ?? t('common:issueCopyingToClipboard'), {
        variant: 'error',
      });
    } else if (state.value) {
      toast(successMessage ?? t('common:copiedToClipboard'));
    }
  }, [state, successMessage, errorMessage]);

  return (
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
      onClick={() => copyToClipboard(textToCopy)}
      endIcon={<CopyIcon fontSize="inherit" />}
      {...buttonProps}
    >
      {buttonLabel ?? textToCopy}
    </Button>
  );
}
