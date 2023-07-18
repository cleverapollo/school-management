import { ConfirmDialog, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ReturnTypeFromUseStaffWorkAbsences,
  useDeleteStaffAbsence,
} from '../../api/staff-work-absences';

export interface DeleteAbsenceConfirmModalProps {
  open: boolean;
  onClose: () => void;
  absenceDetails: ReturnTypeFromUseStaffWorkAbsences | null;
}

export function DeleteAbsenceConfirmModal({
  open,
  onClose,
  absenceDetails,
}: DeleteAbsenceConfirmModalProps) {
  const { t } = useTranslation(['substitution']);
  const { displayName } = usePreferredNameLayout();
  const staffName = displayName(absenceDetails?.staff);

  const { mutateAsync: deleteStaffAbsence } = useDeleteStaffAbsence();

  const onSubmit = async () => {
    if (absenceDetails) {
      await deleteStaffAbsence({ staffAbsenceIds: [absenceDetails.absenceId] });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('substitution:deleteStaffAbsence')}
      description={t('substitution:youAreAboutToDeleteStaffAbsence', {
        staffName,
      })}
      confirmText={t('substitution:yesDeleteAbsence')}
    />
  );
}
