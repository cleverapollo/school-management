import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useDeleteGroups } from '../../api/delete-custom-groups';

export type DeleteGroupsModalProps = {
  groupIds?: number[] | null;
  onClose: () => void;
};

export const DeleteGroupsModal = ({
  groupIds,
  onClose,
}: DeleteGroupsModalProps) => {
  const { t } = useTranslation(['groups', 'common']);

  const {
    mutate: deleteGroups,
    isLoading: isSubmitting,
    isSuccess,
  } = useDeleteGroups();

  const { handleSubmit, reset } = useForm();

  const onSubmit = () => {
    deleteGroups(
      { groupPartyIds: groupIds ?? [] },
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    reset();
  }, [isSuccess, onClose]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!groupIds && !!groupIds.length}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        onClose={onClose}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {t('groups:deleteGroups')}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 3 }}>
          {t('groups:deleteGroupsConfirmation')}
        </Stack>
        <Stack>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              color="error"
            >
              {t('common:actions.delete')}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
};
