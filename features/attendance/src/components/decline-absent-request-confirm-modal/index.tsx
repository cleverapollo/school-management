import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface DeclineAbsentRequestConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onDecline: () => void;
  absentRequestDetails?: SaveParentalAttendanceRequest | undefined;
}

export function DeclineAbsentRequestConfirmModal({
  open,
  onClose,
  onDecline,
  absentRequestDetails,
}: DeclineAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['attendance']);

  const { mutateAsync: saveBulkAbsentRequest } =
    useCreateOrUpdateAbsentRequest();

  const onSubmit = async () => {
    if (absentRequestDetails) {
      await saveBulkAbsentRequest([
        {
          ...absentRequestDetails,
          status: ParentalAttendanceRequestStatus.Denied,
        },
      ]);
      onDecline();
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('attendance:declineAbsentRequest')}
      description={t('attendance:youAreAboutToDeclineAbsentRequest')}
      confirmText={t('attendance:yesDeclineAbsentRequest')}
    />
  );
}
