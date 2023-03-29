import { ComponentProps, useEffect } from 'react';
import { Button } from '@mui/material';
import { CopyIcon } from '@tyro/icons';
import { useCopyToClipboard } from 'react-use';
import { useToast } from '../../hooks';

type CopyClipboardButtonProps = ComponentProps<typeof Button> & {
  textToCopy: string;
  successMessage: string;
  errorMessage: string;
};

export function CopyClipboardButton({
  textToCopy,
  successMessage,
  errorMessage,
  ...buttonProps
}: CopyClipboardButtonProps) {
  const { toast } = useToast();
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.error) {
      toast(errorMessage, { variant: 'error' });
    } else if (state.value) {
      toast(successMessage);
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
      {textToCopy}
    </Button>
  );
}
