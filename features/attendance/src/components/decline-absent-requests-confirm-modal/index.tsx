import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface DeclineAbsentRequestsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  absentRequests: SaveParentalAttendanceRequest[];
}

export function DeclineAbsentRequestsConfirmModal({
  isOpen,
  onClose,
  absentRequests,
}: DeclineAbsentRequestsConfirmModalProps) {
  const { t } = useTranslation(['attendance']);

  const { mutateAsync: saveBulkAbsentRequests } =
    useCreateOrUpdateAbsentRequest();

  const onSubmit = async () => {
    if (absentRequests.length) {
      await saveBulkAbsentRequests(
        absentRequests.map((absentRequest) => ({
          ...absentRequest,
          status: ParentalAttendanceRequestStatus.Denied,
        }))
      );
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('attendance:declineAbsentRequests')}
      description={t('attendance:youAreAboutToDeclineAbsentRequests', {
        count: absentRequests.length,
      })}
      confirmText={t('attendance:yesDeclineAbsentRequests', {
        count: absentRequests.length,
      })}
    />
  );
}
