import { Button, Stack } from '@mui/material';
import {
  RHFTextField,
  useFormValidator,
  DialogTitle,
  DialogActions,
  Dialog,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Swm_UpsertStaffAbsenceType } from '@tyro/api';
import React, { useEffect } from 'react';
import {
  ReturnTypeFromUseAbsenceTypes,
  useCreateOrUpdateAbsenceType,
} from '../../api/staff-work-absence-types';

export type EditAbsenceTypeFormState = Pick<
  Swm_UpsertStaffAbsenceType,
  'absenceTypeId' | 'code'
> & {
  name: string;
  description?: string | null;
};

export type EditAbsenceTypeModalProps = {
  initialAbsenceTypeState?: Partial<EditAbsenceTypeFormState> | undefined;
  absenceTypes: ReturnTypeFromUseAbsenceTypes[];
  onClose: () => void;
};

export const EditAbsenceTypeModal = ({
  initialAbsenceTypeState,
  absenceTypes,
  onClose,
}: EditAbsenceTypeModalProps) => {
  const { t, i18n } = useTranslation(['common', 'absence']);
  const currentLanguageCode = i18n.language;
  const {
    mutate: createOrUpdateAbsenceTypeMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsenceType();

  const { resolver, rules } = useFormValidator<EditAbsenceTypeFormState>();

  const absenceTypesWithoutSelf = absenceTypes.filter(
    (absenceType) => absenceType?.code !== initialAbsenceTypeState?.code
  );

  const { control, handleSubmit, reset } = useForm<EditAbsenceTypeFormState>({
    resolver: resolver({
      name: [
        rules.required(),
        rules.isUniqueByKey(
          absenceTypesWithoutSelf,
          'name',
          t('absence:absenceTypeNameShouldBeUnique')
        ),
      ],
      code: [rules.required()],
      description: [rules.required()],
    }),
    defaultValues: initialAbsenceTypeState,
  });

  const onSubmit = ({
    name,
    description,
    ...restData
  }: EditAbsenceTypeFormState) => {
    createOrUpdateAbsenceTypeMutation(
      [
        {
          name: [{ locale: currentLanguageCode, value: name }],
          description: [{ locale: currentLanguageCode, value: description }],
          availableForRequests: true,
          ...restData,
        },
      ],
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialAbsenceTypeState) {
      reset(initialAbsenceTypeState);
    }
  }, [initialAbsenceTypeState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialAbsenceTypeState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialAbsenceTypeState?.absenceTypeId
          ? t('absence:editAbsenceType')
          : t('absence:createAbsenceType')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Stack direction="row" gap={2}>
            <RHFTextField
              label={t('absence:absenceTypeName')}
              controlProps={{
                name: 'name',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFTextField
              label={t('absence:absenceCode')}
              controlProps={{
                name: 'code',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFTextField
              label={t('common:description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                minRows: 3,
              }}
            />
          </Stack>
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
