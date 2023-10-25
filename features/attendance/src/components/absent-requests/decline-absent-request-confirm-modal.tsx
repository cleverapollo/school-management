import { useTranslation } from '@tyro/i18n';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { Button } from '@mui/material';
import {
  RHFTextField,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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
  absentRequestState?: SaveParentalAttendanceRequest[];
}

export function DeclineAbsentRequestConfirmModal({
  isOpen,
  onClose,
  onDecline,
  absentRequestState,
}: DeclineAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const { resolver, rules } = useFormValidator<DeclineAbsentRequestFormState>();

  const { control, handleSubmit, reset } =
    useForm<DeclineAbsentRequestFormState>({
      resolver: resolver({
        adminNote: [rules.maxLength(100)],
      }),
      defaultValues: absentRequestState?.[0],
    });

  const {
    mutateAsync: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const onSubmit = ({ adminNote }: DeclineAbsentRequestFormState) => {
    if (absentRequestState !== undefined) {
      createOrUpdateAbsentRequestMutation(
        absentRequestState.map((absentRequest) => ({
          ...absentRequest,
          adminNote,
          status: ParentalAttendanceRequestStatus.Denied,
        }))
      );
    }
  };

  useEffect(() => {
    if (absentRequestState !== undefined) {
      reset(absentRequestState[0]);
    }
  }, [absentRequestState]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      onDecline?.();
    }
  }, [isSubmitSuccessful, onDecline]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('attendance:declineAbsentRequest', {
          count: absentRequestState?.length,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            {t('attendance:youAreAboutToDeclineAbsentRequest', {
              count: absentRequestState?.length,
            })}
          </DialogContentText>
          <RHFTextField
            label={t('attendance:feedbackToContactOptional')}
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
              count: absentRequestState?.length,
            })}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
