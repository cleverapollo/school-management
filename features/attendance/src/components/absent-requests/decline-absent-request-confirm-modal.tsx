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
import { RHFTextField, useFormValidator } from '@tyro/core';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export type DeclineAbsentRequestFormState = Pick<
  SaveParentalAttendanceRequest,
  | 'attendanceCodeId'
  | 'from'
  | 'id'
  | 'status'
  | 'studentPartyId'
  | 'to'
  | 'requestType'
  | 'parentNote'
> & {
  adminNote?: string | null;
};

export interface DeclineAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecline?: () => void;
  absentRequestState?:
    | SaveParentalAttendanceRequest[]
    | DeclineAbsentRequestFormState
    | undefined;
}

export function DeclineAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onDecline,
  absentRequestState,
}: DeclineAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const { resolver, rules } = useFormValidator<DeclineAbsentRequestFormState>();

  const isBulkAction = Array.isArray(absentRequestState);

  const { control, handleSubmit, reset } =
    useForm<DeclineAbsentRequestFormState>({
      resolver: resolver({
        adminNote: [rules.maxLength(100)],
      }),
      defaultValues: isBulkAction ? absentRequestState[0] : absentRequestState,
    });

  const {
    mutateAsync: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const onSubmit = ({
    adminNote,
    ...restData
  }: DeclineAbsentRequestFormState) => {
    createOrUpdateAbsentRequestMutation(
      isBulkAction
        ? absentRequestState.map((absentRequest) => ({
            ...absentRequest,
            status: ParentalAttendanceRequestStatus.Denied,
          }))
        : [
            {
              ...restData,
              adminNote,
              status: ParentalAttendanceRequestStatus.Denied,
            },
          ],
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (!isBulkAction) {
      reset(absentRequestState);
    }
  }, [absentRequestState, isBulkAction]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      onDecline && onDecline();
    }
  }, [isSubmitSuccessful, onDecline]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {t('attendance:declineAbsentRequest', {
          count: isBulkAction ? absentRequestState.length : 1,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            {t('attendance:youAreAboutToDeclineAbsentRequest', {
              count: isBulkAction ? absentRequestState.length : 1,
            })}
          </DialogContentText>
          <RHFTextField
            controlProps={{
              name: 'adminNote',
              control,
            }}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              minRows: 3,
              sx: { mt: 3 },
              autoFocus: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton variant="soft" type="submit" loading={isSubmitting}>
            {t('attendance:yesDeclineAbsentRequest', {
              count: isBulkAction ? absentRequestState.length : 1,
            })}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
