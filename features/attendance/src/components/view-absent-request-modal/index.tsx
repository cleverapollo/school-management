import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  GeneralGroup,
  ParentalAttendanceRequest,
  ParentalAttendanceRequestStatus,
} from '@tyro/api';
import React from 'react';
import { Avatar, useDisclosure, usePreferredNameLayout } from '@tyro/core';
import dayjs from 'dayjs';
import { ApproveAbsentRequestConfirmModal } from '../approve-absent-request-confirm-modal';
import { DeclineAbsentRequestConfirmModal } from '../decline-absent-request-confirm-modal';

export type ViewAbsentRequestFormState = Pick<
  ParentalAttendanceRequest,
  | 'adminNote'
  | 'attendanceCodeId'
  | 'contact'
  | 'contactPartyId'
  | 'createdOn'
  | 'from'
  | 'id'
  | 'parentNote'
  | 'requestType'
  | 'status'
  | 'student'
  | 'studentPartyId'
  | 'to'
> & {
  classGroup: Pick<GeneralGroup, 'name'>;
};

export type ViewAbsentRequestModalProps = {
  initialAbsentRequestState?: ParentalAttendanceRequest | undefined;
  onClose: () => void;
};

export const ViewAbsentRequestModal = ({
  initialAbsentRequestState,
  onClose,
}: ViewAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    isOpen: isApproveAbsentRequestModalOpen,
    onOpen: onOpenApproveAbsentRequestModal,
    onClose: onCloseApproveAbsentRequestModal,
  } = useDisclosure();

  const {
    isOpen: isDeclineAbsentRequestModalOpen,
    onOpen: onOpenDeclineAbsentRequestModal,
    onClose: onCloseDeclineAbsentRequestModal,
  } = useDisclosure();

  const { displayName } = usePreferredNameLayout();

  return (
    <Dialog
      open={!!initialAbsentRequestState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:viewAbsentRequest')}</DialogTitle>
      <Stack
        gap={3}
        p={3}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Avatar
          name={displayName(initialAbsentRequestState?.student)}
          src={initialAbsentRequestState?.student?.avatarUrl}
        />
        <Typography component="span" variant="subtitle2">
          {displayName(initialAbsentRequestState?.student)}
        </Typography>
      </Stack>
      <Stack px={3}>
        <Typography component="span" variant="body2">
          Class: <b>{initialAbsentRequestState?.classGroup?.name ?? '-'}</b>
        </Typography>
        <Typography component="span" variant="body2">
          Date of absent request:{' '}
          <b>{dayjs(initialAbsentRequestState?.from).format('D MMMM YYYY')}</b>
        </Typography>
        <Typography component="span" variant="body2">
          Absent type: <b>{initialAbsentRequestState?.attendanceCodeId}</b>
        </Typography>
        <Typography component="span" variant="body2">
          Details: <b>-</b>
        </Typography>
        <Typography component="span" variant="body2">
          Created by:{' '}
          <b>{displayName(initialAbsentRequestState?.contact) ?? '-'}</b>
        </Typography>
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onOpenDeclineAbsentRequestModal}
          disabled={
            initialAbsentRequestState?.status ===
            ParentalAttendanceRequestStatus.Denied
          }
        >
          {t('common:actions.decline')}
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={onOpenApproveAbsentRequestModal}
          disabled={
            initialAbsentRequestState?.status ===
            ParentalAttendanceRequestStatus.Approved
          }
        >
          {t('common:actions.approve')}
        </Button>
      </DialogActions>
      <ApproveAbsentRequestConfirmModal
        isOpen={isApproveAbsentRequestModalOpen}
        onClose={onCloseApproveAbsentRequestModal}
        onApprove={onClose}
        initialAbsentRequestState={initialAbsentRequestState}
      />
      <DeclineAbsentRequestConfirmModal
        isOpen={isDeclineAbsentRequestModalOpen}
        onClose={onCloseDeclineAbsentRequestModal}
        onDecline={onClose}
        initialAbsentRequestState={initialAbsentRequestState}
      />
    </Dialog>
  );
};
