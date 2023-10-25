import { Button, Stack } from '@mui/material';
import {
  RHFDatePicker,
  RHFTextField,
  useFormValidator,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  AcademicNamespaceType,
  ReturnTypeFromUseCoreAcademicNamespace,
  SaveAcademicNamespaceInput,
} from '@tyro/api';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useCreateOrUpdateAcademicYear } from '../../api/academic-namespaces/add-or-update-academic-year';

export type EditAcademicYearFormState = Pick<
  SaveAcademicNamespaceInput,
  'id' | 'name' | 'year' | 'description'
> & {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

export type EditAcademicYearViewProps = {
  initialAcademicYearState?: EditAcademicYearFormState | undefined;
  academicYears: ReturnTypeFromUseCoreAcademicNamespace[];
  onClose: () => void;
};

export const EditAcademicYearModal = ({
  initialAcademicYearState,
  academicYears,
  onClose,
}: EditAcademicYearViewProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const {
    mutate: createOrUpdateAcademicYearMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAcademicYear();

  const { resolver, rules } = useFormValidator<EditAcademicYearFormState>();

  const defaultFormStateValues: Partial<EditAcademicYearFormState> = {
    ...initialAcademicYearState,
  };

  const academicYearsWithoutSelf = academicYears.filter(
    (academicYear) =>
      academicYear?.academicNamespaceId !== initialAcademicYearState?.id
  );

  const { control, handleSubmit, reset } = useForm<EditAcademicYearFormState>({
    resolver: resolver({
      name: [
        rules.required(),
        rules.isUniqueByKey(
          academicYearsWithoutSelf,
          'name',
          t('settings:academicYearNameShouldBeUnique')
        ),
      ],
      year: [rules.required(), rules.min(1900), rules.max(2100)],
      startDate: [rules.required(), rules.date()],
      endDate: [
        rules.required(),
        rules.date(),
        rules.afterStartDate('startDate'),
      ],
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = ({
    startDate,
    endDate,
    year,
    ...restData
  }: EditAcademicYearFormState) => {
    createOrUpdateAcademicYearMutation(
      {
        ...restData,
        year: Number(year),
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        type: AcademicNamespaceType.Year,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialAcademicYearState) {
      reset({
        ...defaultFormStateValues,
        ...initialAcademicYearState,
      });
    }
  }, [initialAcademicYearState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialAcademicYearState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialAcademicYearState?.id
          ? t('settings:editAcademicYear')
          : t('settings:createAcademicYear')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField<EditAcademicYearFormState>
            label={t('common:name')}
            controlProps={{
              name: 'name',
              control,
            }}
          />

          <RHFTextField<EditAcademicYearFormState>
            label={t('common:year')}
            controlProps={{
              name: 'year',
              control,
            }}
            textFieldProps={{
              type: 'number',
            }}
          />
          <RHFTextField<EditAcademicYearFormState>
            label={t('common:description')}
            controlProps={{
              name: 'description',
              control,
            }}
            textFieldProps={{
              multiline: true,
              rows: 4,
            }}
          />
          <Stack direction="row" gap={1}>
            <RHFDatePicker<EditAcademicYearFormState>
              label={t('common:startDate')}
              inputProps={{ fullWidth: true }}
              controlProps={{ name: 'startDate', control }}
            />
            <RHFDatePicker<EditAcademicYearFormState>
              label={t('common:endDate')}
              inputProps={{ fullWidth: true }}
              controlProps={{ name: 'endDate', control }}
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
