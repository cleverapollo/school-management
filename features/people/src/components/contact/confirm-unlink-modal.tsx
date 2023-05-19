import { Button, DialogTitle, DialogActions, Dialog } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export type ConfirmUnlinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ConfirmUnlinkModal = ({
  isOpen,
  onClose,
}: ConfirmUnlinkModalProps) => {
  const { t } = useTranslation(['people', 'common']);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t('people:messageUnlinkContact')}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>{t('common:actions.cancel')}</Button>
        <Button onClick={onClose} autoFocus>
          {t('people:yesUnlink')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
