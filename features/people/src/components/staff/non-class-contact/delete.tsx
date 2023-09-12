import { ConfirmDialog, useNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { NonClassContactHours, useAcademicNamespace } from '@tyro/api';
import { useDeleteNonClassContact } from '../../../api/staff/delete-non-class-contact';

export interface DeleteNonClassContactConfirmModalProps {
  open: boolean;
  onClose: () => void;
  nonClassContactHourDetails: NonClassContactHours | null;
}

export function DeleteNonClassContactConfirmModal({
  open,
  onClose,
  nonClassContactHourDetails,
}: DeleteNonClassContactConfirmModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const staffId = useNumber(id);
  const { activeAcademicNamespace } = useAcademicNamespace();

  const { mutateAsync: deleteNonClassContact } = useDeleteNonClassContact({
    academicNameSpaceId: activeAcademicNamespace?.academicNamespaceId ?? 0,
    staffPartyId: staffId ?? 0,
  });

  const onSubmit = async () => {
    if (nonClassContactHourDetails?.nonClassContactHoursId) {
      await deleteNonClassContact({
        nonClassContactHoursId:
          nonClassContactHourDetails.nonClassContactHoursId,
        staffPartyId: nonClassContactHourDetails.staffPartyId,
      });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('people:deleteNonClassContact')}
      description={t('people:areYouSureYouWantToDeleteNonClassContact')}
      confirmText={t('common:delete')}
    />
  );
}
