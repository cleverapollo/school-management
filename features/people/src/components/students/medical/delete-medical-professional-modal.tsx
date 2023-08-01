import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import { DeleteStudentMedicalContactInput } from '@tyro/api';
import { useDeleteMedicalProfessional } from '../../../api/student/medicals/delete-medical-professional';

export type DeleteMedicalProfessionalProps = {
  open: boolean;
  studentId: number;
  onClose: () => void;
  medicalContactId: number;
};

export const DeleteMedicalProfessionalModal = ({
  open,
  studentId,
  onClose,
  medicalContactId,
}: DeleteMedicalProfessionalProps) => {
  const { t } = useTranslation(['people', 'common']);
  const { mutate: deleteMedicalProfessional, isLoading: isSubmitting } =
    useDeleteMedicalProfessional();

  const handleSubmit = () => {
    const data: DeleteStudentMedicalContactInput = {
      id: medicalContactId ?? 0,
      studentPartyId: studentId ?? 0,
    };

    deleteMedicalProfessional(data, {
      onSuccess: onClose,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('people:deleteMedicalProfessional')}</DialogTitle>

      <Stack sx={{ p: 3 }}>
        {t('people:deleteMedicalProfessionalConfirmation')}
      </Stack>
      <Stack spacing={2}>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('common:cancelConfirmDialog.title')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            {t('common:delete')}
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};
