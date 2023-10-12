import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@tyro/core';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export interface ApproveAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  absentRequestState?: SaveParentalAttendanceRequest[];
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

  const onSubmit = () => {
    if (absentRequestState !== undefined) {
      createOrUpdateAbsentRequestMutation(
        absentRequestState.map((absentRequest) => ({
          ...absentRequest,
          status: ParentalAttendanceRequestStatus.Approved,
        }))
      );
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      onApprove?.();
    }
  }, [isSubmitSuccessful, onApprove]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('attendance:approveAbsentRequest', {
          count: absentRequestState?.length,
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('attendance:youAreAboutToApproveAbsentRequest', {
            count: absentRequestState?.length,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="soft" loading={isSubmitting} onClick={onSubmit}>
          {t('attendance:yesApproveAbsentRequest', {
            count: absentRequestState?.length,
          })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
