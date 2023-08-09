import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface ApproveAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  absentRequestState:
    | SaveParentalAttendanceRequest[]
    | SaveParentalAttendanceRequest
    | undefined;
}

export function ApproveAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onApprove,
  absentRequestState,
}: ApproveAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    mutate: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const isBulkAction = Array.isArray(absentRequestState);

  const onSubmit = async () => {
    if (absentRequestState !== undefined) {
      await createOrUpdateAbsentRequestMutation(
        (isBulkAction ? absentRequestState : [absentRequestState]).map(
          (absentRequest) => ({
            ...absentRequest,
            status: ParentalAttendanceRequestStatus.Approved,
          })
        )
      );
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      onApprove && onApprove();
    }
  }, [isSubmitSuccessful, onApprove]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {t('attendance:approveAbsentRequest', {
          count: isBulkAction ? absentRequestState.length : 1,
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('attendance:youAreAboutToApproveAbsentRequest', {
            count: isBulkAction ? absentRequestState.length : 1,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="soft" loading={isSubmitting} onClick={onSubmit}>
          {t('attendance:yesApproveAbsentRequest', {
            count: isBulkAction ? absentRequestState.length : 1,
          })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
