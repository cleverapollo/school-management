import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface ApproveAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  initialAbsentRequestState?: SaveParentalAttendanceRequest | undefined;
}

export function ApproveAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onApprove,
  initialAbsentRequestState,
}: ApproveAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['attendance']);

  const { mutateAsync: saveBulkAbsentRequest } =
    useCreateOrUpdateAbsentRequest();

  const onSubmit = async () => {
    if (initialAbsentRequestState) {
      await saveBulkAbsentRequest([
        {
          ...initialAbsentRequestState,
          status: ParentalAttendanceRequestStatus.Approved,
        },
      ]);
      onApprove();
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('attendance:approveAbsentRequest')}
      description={t('attendance:youAreAboutToApproveAbsentRequest')}
      confirmText={t('attendance:yesApproveAbsentRequest')}
    />
  );
}
