import {
  Button,
  DialogContent,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import { FileTransferFeature } from '@tyro/api';
import { ReturnTypeFromUseDocuments } from '../../api/documents/list';
import { useDeleteDocuments } from '../../api/documents/delete';

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
  const { mutate: deleteDocuments, isLoading } = useDeleteDocuments(
    FileTransferFeature.StudentDocs
  );

  const deleteFile = () => {
    deleteDocuments(documents?.map(({ id }) => id) ?? [], {
      onSuccess: onClose,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>{t('people:deleteFiles')}</DialogTitle>
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
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton
          onClick={deleteFile}
          variant="contained"
          loading={isLoading}
        >
          {t('people:actions.deleteFiles')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
