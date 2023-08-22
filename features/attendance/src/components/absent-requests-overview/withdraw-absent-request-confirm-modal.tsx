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
import { useWithdrawAbsentRequest } from '../../api';

export interface WithdrawAbsentRequestConfirmModalProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawAbsentRequestConfirmModal({
  id,
  isOpen,
  onClose,
}: WithdrawAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const { mutate } = useWithdrawAbsentRequest();

  const onSubmit = () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
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
