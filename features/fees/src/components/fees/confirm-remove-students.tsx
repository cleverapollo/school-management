import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Button } from '@mui/material';
import { useExcludeStudentsFromFee } from '../../api/exclude-students';
import { ReturnTypeFromUseFeeDebtors } from '../../api/debtors';

interface ConfirmRemoveStudentsFromFeeDialogProps {
  open: boolean;
  onClose: () => void;
  feeId: number;
  students: ReturnTypeFromUseFeeDebtors[];
}

export function ConfirmRemoveStudentsFromFeeDialog({
  open,
  onClose,
  feeId,
  students,
}: ConfirmRemoveStudentsFromFeeDialogProps) {
  const { t } = useTranslation(['common', 'fees']);
  const { mutateAsync, isLoading: isSubmitting } = useExcludeStudentsFromFee();
  const { displayName } = usePreferredNameLayout();

  const onConfirm = async () => {
    await mutateAsync(
      {
        feeId,
        partyIds: students.map((student) => student.person.partyId),
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('fees:removeStudent', { count: students.length })}
      </DialogTitle>
      <DialogContent>
        <span>
          {t('fees:removeStudentConfirmation', { count: students.length })}
        </span>
        <ul>
          {students.map((student) => (
            <li key={student.person.partyId}>{displayName(student.person)}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="soft"
          onClick={onConfirm}
          loading={isSubmitting}
        >
          {t('common:actions.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
