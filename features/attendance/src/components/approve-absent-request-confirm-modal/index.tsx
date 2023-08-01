import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface ApproveAbsentRequestConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  absentRequestDetails?: SaveParentalAttendanceRequest | undefined;
}

export function ApproveAbsentRequestConfirmModal({
  open,
  onClose,
  onApprove,
  absentRequestDetails,
}: ApproveAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['attendance']);

  const { mutateAsync: saveBulkAbsentRequest } =
    useCreateOrUpdateAbsentRequest();

  const onSubmit = async () => {
    if (absentRequestDetails) {
      await saveBulkAbsentRequest([
        {
          ...absentRequestDetails,
          status: ParentalAttendanceRequestStatus.Approved,
        },
      ]);
      onApprove();
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('attendance:approveAbsentRequest')}
      description={t('attendance:youAreAboutToApproveAbsentRequest')}
      confirmText={t('attendance:yesApproveAbsentRequest')}
    />
  );
}
