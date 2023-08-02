import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface ApproveAbsentRequestsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  absentRequests: SaveParentalAttendanceRequest[];
}

export function ApproveAbsentRequestsConfirmModal({
  isOpen,
  onClose,
  absentRequests,
}: ApproveAbsentRequestsConfirmModalProps) {
  const { t } = useTranslation(['attendance']);

  const { mutate: saveBulkAbsentRequests } = useCreateOrUpdateAbsentRequest();

  const onSubmit = async () => {
    if (absentRequests?.length) {
      await saveBulkAbsentRequests(
        absentRequests.map((absentRequest) => ({
          ...absentRequest,
          status: ParentalAttendanceRequestStatus.Approved,
        }))
      );
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('attendance:approveAbsentRequests')}
      description={t('attendance:youAreAboutToApproveAbsentRequests', {
        count: absentRequests.length,
      })}
      confirmText={t('attendance:yesApproveAbsentRequests', {
        count: absentRequests.length,
      })}
    />
  );
}
