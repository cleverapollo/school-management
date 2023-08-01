import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import React, { useState } from 'react';
import { ApproveAbsentRequestConfirmModal } from '../approve-absent-request-confirm-modal';
import { DeclineAbsentRequestConfirmModal } from '../decline-absent-request-confirm-modal';

export type ViewAbsentRequestModalProps = {
  absentRequestDetails?: SaveParentalAttendanceRequest | undefined;
  onClose: () => void;
};

export const ViewAbsentRequestModal = ({
  absentRequestDetails,
  onClose,
}: ViewAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const [
    showApproveAbsentRequestConfirmModal,
    setShowApproveAbsentRequestConfirmModal,
  ] = useState(false);
  const [
    showDeclineAbsentRequestConfirmModal,
    setShowDeclineAbsentRequestConfirmModal,
  ] = useState(false);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={!!absentRequestDetails}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:viewAbsentRequest')}</DialogTitle>
      <Stack gap={3} p={3}>
        <TextField
          label={t('attendance:attendanceType')}
          value={absentRequestDetails?.requestType}
        />
        <TextField
          label={t('common:details')}
          value={absentRequestDetails?.parentNote}
        />
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('common:actions.cancel')}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => setShowDeclineAbsentRequestConfirmModal(true)}
          disabled={
            absentRequestDetails?.status ===
            ParentalAttendanceRequestStatus.Denied
          }
        >
          {t('common:actions.decline')}
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => setShowApproveAbsentRequestConfirmModal(true)}
          disabled={
            absentRequestDetails?.status ===
            ParentalAttendanceRequestStatus.Approved
          }
        >
          {t('common:actions.approve')}
        </Button>
      </DialogActions>
      <ApproveAbsentRequestConfirmModal
        open={showApproveAbsentRequestConfirmModal}
        onClose={() => setShowApproveAbsentRequestConfirmModal(false)}
        onApprove={onClose}
        absentRequestDetails={absentRequestDetails}
      />
      <DeclineAbsentRequestConfirmModal
        open={showDeclineAbsentRequestConfirmModal}
        onClose={() => setShowDeclineAbsentRequestConfirmModal(false)}
        onDecline={onClose}
        absentRequestDetails={absentRequestDetails}
      />
    </Dialog>
  );
};
