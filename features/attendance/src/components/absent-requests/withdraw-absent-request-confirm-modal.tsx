import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@tyro/core';
import { useWithdrawAbsentRequest } from '../../api';

export interface WithdrawAbsentRequestConfirmModalProps {
  id: number;
  isOpen: boolean;
  onWithdraw?: () => void;
  onClose: () => void;
}

export function WithdrawAbsentRequestConfirmModal({
  id,
  isOpen,
  onWithdraw,
  onClose,
}: WithdrawAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const { mutate, isLoading } = useWithdrawAbsentRequest();

  const onSubmit = () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          onWithdraw?.();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('attendance:withdrawAbsentRequest')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('attendance:youAreAboutToWithdrawAbsentRequest')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="soft" onClick={onSubmit} loading={isLoading}>
          {t('attendance:yesWithdrawAbsentRequest')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
