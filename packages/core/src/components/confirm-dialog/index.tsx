import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useId } from 'react';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';

export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmText,
  cancelText,
  open,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const { t } = useTranslation(['common']);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {cancelText || t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="soft"
          loading={false}
          onClick={async () => {
            const f = async () => {
              // eslint-disable-next-line @typescript-eslint/await-thenable
              await onConfirm();
            };
            await f();
            onClose();
          }}
        >
          {confirmText || t('common:actions.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
