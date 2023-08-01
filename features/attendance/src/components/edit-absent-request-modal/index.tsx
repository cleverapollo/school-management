import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { RHFSelect, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  ParentalAttendanceRequestType,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import React, { useEffect } from 'react';
import { useCreateOrUpdateAbsentRequest } from '../../api';

export type EditAbsentRequestFormState = Pick<
  SaveParentalAttendanceRequest,
  | 'adminNote'
  | 'attendanceCodeId'
  | 'from'
  | 'id'
  | 'status'
  | 'studentPartyId'
  | 'to'
> & {
  requestType: ParentalAttendanceRequestType;
  parentNote: string;
};

export type EditAbsentRequestModalProps = {
  initialAbsentRequestState?: EditAbsentRequestFormState | undefined;
  onClose: () => void;
};

export const EditAbsentRequestModal = ({
  initialAbsentRequestState,
  onClose,
}: EditAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const {
    mutate: createOrUpdateAbsentRequestMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsentRequest();

  const { resolver, rules } = useFormValidator<EditAbsentRequestFormState>();

  const { control, handleSubmit, reset } = useForm<EditAbsentRequestFormState>({
    resolver: resolver({
      requestType: [rules.required()],
      parentNote: [rules.required()],
    }),
    defaultValues: {
      ...initialAbsentRequestState,
      requestType:
        initialAbsentRequestState?.requestType ??
        ParentalAttendanceRequestType.MultiDay,
    },
    mode: 'onChange',
  });

  const onSubmit = ({
    requestType,
    parentNote,
    ...restData
  }: EditAbsentRequestFormState) => {
    createOrUpdateAbsentRequestMutation(
      [
        {
          requestType,
          parentNote,
          ...restData,
        },
      ],
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialAbsentRequestState) {
      reset(initialAbsentRequestState);
    }
  }, [initialAbsentRequestState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialAbsentRequestState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialAbsentRequestState?.id
          ? t('attendance:editAbsentRequest')
          : t('attendance:createAbsentRequest')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <RHFSelect
            fullWidth
            options={Object.values(ParentalAttendanceRequestType)}
            label={t('attendance:attendanceType')}
            getOptionLabel={(option) => option}
            controlProps={{
              name: 'requestType',
              control,
            }}
          />
          <RHFTextField
            label={t('common:details')}
            controlProps={{
              name: 'parentNote',
              control,
            }}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              minRows: 3,
            }}
          />
        </Stack>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
