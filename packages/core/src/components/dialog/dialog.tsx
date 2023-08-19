import {
  Dialog as MUIDialog,
  DialogProps as MUIDialogProps,
} from '@mui/material';

export interface DialogProps extends MUIDialogProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: ((event: {}, reason: 'escapeKeyDown') => void) | undefined;
}

export function Dialog({ onClose, ...props }: DialogProps) {
  return (
    <MUIDialog
      {...props}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose?.(event, reason);
      }}
    />
  );
}
