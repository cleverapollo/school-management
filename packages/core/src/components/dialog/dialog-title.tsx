import {
  DialogTitle as MUIDialogTitle,
  DialogTitleProps as MUIDialogTitleProps,
  Stack,
  StackProps,
} from '@mui/material';
import { DialogCloseButton } from './dialog-close-button';

export interface DialogTitleProps extends MUIDialogTitleProps {
  onClose?: () => void;
  containerProps?: StackProps;
}

export function DialogTitle({
  onClose,
  containerProps,
  ...props
}: DialogTitleProps) {
  return (
    <Stack
      direction="row"
      p={3}
      pr={onClose ? 8 : 3}
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      {...containerProps}
    >
      <MUIDialogTitle p="0 !important" {...props} />
      {typeof onClose === 'function' && (
        <DialogCloseButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 24,
          }}
        />
      )}
    </Stack>
  );
}
