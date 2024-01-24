import { useEffect } from 'react';
import {
  Button,
  DialogContent,
  Stack,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { ReturnTypeFromUseDocuments } from '../../api/documents/list';

export type DeleteDocumentsModalProps = {
  documents?: ReturnTypeFromUseDocuments[];
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteDocumentsModal = ({
  documents,
  isOpen,
  onClose,
}: DeleteDocumentsModalProps) => {
  const { t } = useTranslation(['people', 'common']);

  const { handleSubmit, reset } = useForm();

  const onSubmit = () => {
    // TODO: integrate after api ready
  };

  useEffect(() => {
    reset();
  }, [onClose]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={handleClose}>{t('people:deleteFiles')}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography>{t('people:youAreAboutToDeleteFiles')}</Typography>
          <List sx={{ maxHeight: 300, overflowY: 'auto', listStyle: 'inside' }}>
            {documents?.map(({ id, fileName }) => (
              <ListItem key={id} sx={{ display: 'list-item' }}>
                {fileName}
              </ListItem>
            ))}
          </List>
          <Typography>{t('people:deleteDocumentsConfirmation')}</Typography>
        </DialogContent>
        <Stack>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton type="submit" variant="contained">
              {t('people:actions.deleteFiles')}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
};
