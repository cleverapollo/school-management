import { TFunction, useTranslation } from '@tyro/i18n';
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

interface DeclineAbsentRequestFormProps {
  onSubmit: (formState: DeclineAbsentRequestFormState) => void;
  onCancel: () => void;
  initialAbsentRequestState: DeclineAbsentRequestFormState | undefined;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  translate: TFunction<('common' | 'attendance')[]>;
}

export interface DeclineAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecline?: () => void;
  absentRequestState?:
    | SaveParentalAttendanceRequest[]
    | DeclineAbsentRequestFormState
    | undefined;
}

const DeclineAbsentRequestForm = ({
  onSubmit,
  onCancel,
  initialAbsentRequestState,
  isSubmitSuccessful,
  translate,
  isSubmitting,
}: DeclineAbsentRequestFormProps) => {
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

  const handleCancel = () => {
    onCancel();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          {translate('attendance:youAreAboutToDeclineAbsentRequest')}
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
        <Button autoFocus onClick={handleCancel}>
          {translate('common:actions.cancel')}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {translate('attendance:yesDeclineAbsentRequest')}
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export function DeclineAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onDecline,
  absentRequestState,
}: DeclineAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    mutateAsync: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const isBulkAction = Array.isArray(absentRequestState);

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
  };

  const onBulkSubmit = () => {
    if (Array.isArray(absentRequestState)) {
      createOrUpdateAbsentRequestMutation(
        absentRequestState.map((absentRequest) => ({
          ...absentRequest,
          status: ParentalAttendanceRequestStatus.Denied,
        }))
      );
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      onDecline && onDecline();
    }
  }, [isSubmitSuccessful, onDecline]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {isBulkAction
          ? t('attendance:declineAbsentRequests')
          : t('attendance:declineAbsentRequest')}
      </DialogTitle>
      {isBulkAction ? (
        <>
          <DialogContent>
            <DialogContentText>
              {t('attendance:youAreAboutToDeclineAbsentRequests', {
                count: absentRequestState.length,
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>
              {t('common:actions.cancel')}
            </Button>
            <LoadingButton
              variant="soft"
              loading={isSubmitting}
              onClick={onBulkSubmit}
            >
              {t('attendance:yesDeclineAbsentRequests', {
                count: absentRequestState.length,
              })}
            </LoadingButton>
          </DialogActions>
        </>
      ) : (
        <DeclineAbsentRequestForm
          isSubmitSuccessful={isSubmitSuccessful}
          isSubmitting={isSubmitting}
          initialAbsentRequestState={absentRequestState}
          onCancel={onClose}
          onSubmit={onSubmit}
          translate={t}
        />
      )}
    </Dialog>
  );
}
