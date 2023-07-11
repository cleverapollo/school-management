import { useEffect } from 'react';
import {
  Box,
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  UpsertStudentMedicalConditionInput,
  DeleteStudentMedicalConditionInput,
} from '@tyro/api';
import { useDeleteCondition } from '../../../api/student/medicals/delete-condition';
import { ReturnTypeFromUseStudentMedical } from './conditions-table';

export type DeleteConditionsState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment' | 'studentPartyId'
>;

export type DeleteConditionsProps = {
  studentId: number | undefined;
  initialConditionsState?: Partial<DeleteConditionsState> | null;
  conditions: ReturnTypeFromUseStudentMedical[];
  onClose: () => void;
};

export const DeleteConditionsModal = ({
  studentId,
  initialConditionsState,
  conditions,
  onClose,
}: DeleteConditionsProps) => {
  const { t } = useTranslation(['settings', 'people', 'common']);

  const {
    mutate: deleteStudentMedicalCondition,
    isLoading: isSubmitting,
    isSuccess,
  } = useDeleteCondition();

  const { handleSubmit, reset } = useForm();

  const test: DeleteStudentMedicalConditionInput = {
    id: initialConditionsState?.id ?? 0,
    studentPartyId: studentId ?? 0,
  };

  const onSubmit = () => {
    deleteStudentMedicalCondition(test, {
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
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {t('people:deleteCondition')}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 3, backgroundColor: 'slate.50' }}>
          Are you sure you want to delete this condition?
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
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
};
