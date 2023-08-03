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
  onDecline: () => void;
  initialAbsentRequestState?: DeclineAbsentRequestFormState | undefined;
}

export function DeclineAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onDecline,
  initialAbsentRequestState,
}: DeclineAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    mutateAsync: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const { resolver, rules } = useFormValidator<DeclineAbsentRequestFormState>();

  const { control, handleSubmit, reset } =
    useForm<DeclineAbsentRequestFormState>({
      resolver: resolver({
        adminNote: [rules.maxLength(100)],
      }),
      defaultValues: {
        ...initialAbsentRequestState,
        adminNote: initialAbsentRequestState?.adminNote ?? '',
      },
      mode: 'onChange',
    });

  const onSubmit = ({
    adminNote,
    ...restData
  }: DeclineAbsentRequestFormState) => {
    createOrUpdateAbsentRequestMutation(
      [
        {
          adminNote,
          ...restData,
          status: ParentalAttendanceRequestStatus.Denied,
        },
      ],
      {
        onSuccess: onClose,
      }
    );
    onClose();
    onDecline();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    if (initialAbsentRequestState) {
      reset(initialAbsentRequestState);
    }
  }, [initialAbsentRequestState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{t('attendance:declineAbsentRequest')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            {t('attendance:youAreAboutToDeclineAbsentRequest')}
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
          <Button autoFocus onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('attendance:yesDeclineAbsentRequest')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
