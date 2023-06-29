import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import LoadingButton from '@mui/lab/LoadingButton';
import { EnrollmentIre_ChangeProgrammeStage } from '@tyro/api';
import { useEffect } from 'react';
import { useChangeProgrammeStage } from '../../../api/student/change-programme-stage';
import { StudentList, StudentListFormState } from './student-list';

type FormState = StudentListFormState;

type ChangeYearGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students: StudentListFormState['students'];
};

export function ChangeProgrammeYearModal({
  isOpen,
  students,
  onClose,
}: ChangeYearGroupModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { reset, control, handleSubmit } = useForm<FormState>();

  const { mutate: changeProgrammeStageMutation, isLoading } =
    useChangeProgrammeStage();

  useEffect(() => {
    if (students.length > 0) {
      reset({
        students: students.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }, [students]);

  const onCancel = () => {
    onClose();
    reset();
  };

  const onSubmit = ({ students: studentsFormData }: FormState) => {
    const toUpdate = studentsFormData
      .filter((student) => student.programmeStage)
      .map((student) => ({
        studentPartyId: student.id,
        programmeStageId: student.programmeStage?.id,
      })) as EnrollmentIre_ChangeProgrammeStage[];

    changeProgrammeStageMutation(toUpdate, { onSuccess: onCancel });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{t('people:changeProgrammeYearModalTitle')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2}>
            <DialogContentText>
              {t('people:changeProgrammeYearModalDescription')}
            </DialogContentText>
            <StudentList control={control} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('people:changeProgrammeYear')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
