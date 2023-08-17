import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export interface WithdrawAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onWithdraw?: () => void;
  onClose: () => void;
}

export function WithdrawAbsentRequestConfirmModal({
  isOpen,
  onWithdraw,
  onClose,
}: WithdrawAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const onSubmit = () => {
    onClose();
    onWithdraw?.();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t('attendance:withdrawAbsentRequest')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('attendance:youAreAboutToWithdrawAbsentRequest')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="soft" onClick={onSubmit}>
          {t('attendance:yesWithdrawAbsentRequest')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
