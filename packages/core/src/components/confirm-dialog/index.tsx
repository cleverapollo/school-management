import { Button } from '@mui/material';
import { useId, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '../dialog';

export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isDelete?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmText,
  cancelText,
  open,
  onConfirm,
  onClose,
  isDelete = false,
}: ConfirmDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation(['common']);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle onClose={onClose} id={titleId}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="inherit" variant="soft" onClick={onClose}>
          {cancelText || t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          color={isDelete ? 'error' : 'primary'}
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await (async function () {
              // eslint-disable-next-line @typescript-eslint/await-thenable
              await onConfirm();
            })();
            setLoading(false);
            onClose();
          }}
        >
          {confirmText || t('common:actions.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
