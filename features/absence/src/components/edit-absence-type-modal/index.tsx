import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Swm_UpsertStaffAbsenceType, TuslaCode } from '@tyro/api';
import React, { useEffect } from 'react';
import { CloseIcon, InfoCircleIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseAbsenceTypes,
  useCreateOrUpdateAbsenceType,
} from '../../api';

export type EditAbsenceTypeFormState = Pick<
  Swm_UpsertStaffAbsenceType,
  'absenceTypeId' | 'availableForRequests' | 'code' | 'description' | 'name'
> & {
  name: string;
  description?: string | null;
  visibleForAdmin?: boolean;
  availableForRequests: boolean;
};

export type EditAbsenceTypeViewProps = {
  initialAbsenceTypeState?: EditAbsenceTypeFormState | undefined;
  absenceTypes: ReturnTypeFromUseAbsenceTypes[];
  onClose: () => void;
};

export const EditAbsenceTypeModal = ({
  initialAbsenceTypeState,
  absenceTypes,
  onClose,
}: EditAbsenceTypeViewProps) => {
  const { t, i18n } = useTranslation(['common', 'absence']);
  const currentLanguageCode = i18n.language;
  const {
    mutate: createOrUpdateAbsenceTypeMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAbsenceType();

  const { resolver, rules } = useFormValidator<EditAbsenceTypeFormState>();

  const defaultFormStateValues: Partial<EditAbsenceTypeFormState> = {
    ...initialAbsenceTypeState,
    visibleForAdmin: true,
  };

  const absenceTypesWithoutSelf = absenceTypes.filter(
    (absenceType) => absenceType?.code !== initialAbsenceTypeState?.code
  );

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<EditAbsenceTypeFormState>({
      resolver: resolver({
        name: [
          rules.required(),
          rules.max(20),
          rules.isUniqueByKey(
            absenceTypesWithoutSelf as [],
            'name',
            t('absence:absenceTypeNameShouldBeUnique') ?? ''
          ),
        ],
        description: [rules.required(), rules.max(20)],
        availableForRequests: [rules.required()],
      }),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({
    name,
    description,
    availableForRequests,
    ...restData
  }: EditAbsenceTypeFormState) => {
    createOrUpdateAbsenceTypeMutation(
      [
        {
          name: [{ locale: currentLanguageCode, value: name }],
          description: [{ locale: currentLanguageCode, value: description }],
          availableForRequests,
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
      reset({
        ...defaultFormStateValues,
        ...initialAbsenceTypeState,
      });
    }
  }, [initialAbsenceTypeState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const [code] = watch(['code']);

  useEffect(() => {
    if (code) {
      // @ts-ignore
      setValue('description', t(`absence:tuslaCodeDescription.${code}`));
    } else {
      // @ts-ignore
      setValue('description', '');
    }
  }, [code]);

  const handleClearCode = () => {
    setValue('code', '');
  };

  return (
    <Dialog
      open={!!initialAbsenceTypeState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialAbsenceTypeState?.absenceTypeId
          ? t('absence:editAbsenceType')
          : t('absence:createAbsenceType')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Stack direction="row" gap={2}>
            <RHFTextField<EditAbsenceTypeFormState>
              label={t('absence:absenceTypeName') ?? ''}
              controlProps={{
                name: 'name',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFSelect<EditAbsenceTypeFormState, TuslaCode>
              fullWidth
              options={Object.values(TuslaCode)}
              label={t('absence:tuslaCode')}
              getOptionLabel={(option) => option}
              InputProps={{
                endAdornment: code && (
                  <IconButton
                    sx={{ mr: 2 }}
                    type="button"
                    onClick={handleClearCode}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              controlProps={{
                name: 'code',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFTextField<EditAbsenceTypeFormState>
              label={t('common:description') ?? ''}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                disabled: Boolean(code),
                inputProps: {
                  readOnly: Boolean(code),
                },
              }}
            />
          </Stack>
        </Stack>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: 'slate.50',
            border: 1,
            borderColor: 'slate.200',
            width: '60%',
            p: 1,
            ml: 3,
          }}
        >
          <RHFCheckbox
            label={t('absence:availableForRequests')}
            controlLabelProps={{
              sx: { width: '100%', ml: 0, height: '100%' },
            }}
            checkboxProps={{ color: 'primary' }}
            controlProps={{ name: 'availableForRequests', control }}
          />
        </Box>

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
