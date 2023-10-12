import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  UpsertStudentMedicalConditionInput,
  DeleteStudentMedicalConditionInput,
} from '@tyro/api';
import { useDeleteCondition } from '../../../api/student/medicals/delete-condition';

export type DeleteConditionsState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'studentPartyId'
>;

export type DeleteConditionsProps = {
  studentId: number | undefined;
  initialConditionsState?: Partial<DeleteConditionsState> | null;
  onClose: () => void;
};

export const DeleteConditionsModal = ({
  studentId,
  initialConditionsState,
  onClose,
}: DeleteConditionsProps) => {
  const { t } = useTranslation(['people', 'common']);

  const {
    mutate: deleteStudentMedicalCondition,
    isLoading: isSubmitting,
    isSuccess,
  } = useDeleteCondition();

  const { handleSubmit, reset } = useForm();

  const onSubmit = () => {
    const data: DeleteStudentMedicalConditionInput = {
      id: initialConditionsState?.id ?? 0,
      studentPartyId: studentId ?? 0,
    };

    deleteStudentMedicalCondition(data, {
      onSuccess: onClose,
    });
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
      open={!!initialConditionsState}
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
        {t('people:deleteCondition')}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 3 }}>{t('people:deleteConditionConfirmation')}</Stack>
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
