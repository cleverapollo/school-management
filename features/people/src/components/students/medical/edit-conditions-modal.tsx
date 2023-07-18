import { useEffect } from 'react';
import {
  Button,
  DialogTitle,
  Grid,
  DialogActions,
  Dialog,
} from '@mui/material';
import { RHFTextField, RHFAutocomplete, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { UpsertStudentMedicalConditionInput } from '@tyro/api';
import { useCreateOrUpdateCondition } from '../../../api/student/medicals/upsert-medical-conditions';
import { useMedicalConditionNamesQuery } from '../../../api/student/medicals/medical-condition-lookup';

export type EditConditionsFormState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment' | 'studentPartyId'
>;

export type EditConditionsProps = {
  studentId: number | undefined;
  initialConditionsState?: Partial<EditConditionsFormState> | null;
  onClose: () => void;
};

export const EditConditionsModal = ({
  studentId,
  initialConditionsState,
  onClose,
}: EditConditionsProps) => {
  const { t } = useTranslation(['people', 'common']);
  const { data: medicalConditionNames } = useMedicalConditionNamesQuery();

  const {
    mutate: createOrUpdateConditionsMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateCondition();

  const { resolver, rules } = useFormValidator<EditConditionsFormState>();

  const defaultFormStateValues: Partial<EditConditionsFormState> = {
    ...initialConditionsState,
  };

  const { control, handleSubmit, reset } = useForm<EditConditionsFormState>({
    resolver: resolver({
      name: [rules.required()],
      description: [rules.required()],
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(({ equipment, ...restData }) => {
    createOrUpdateConditionsMutation(
      {
        ...restData,
        equipment: (equipment ?? []).map(({ name, location }) => ({
          name,
          location,
        })),
        studentPartyId: studentId ?? 0,
      },
      { onSuccess: onClose }
    );
  });

  useEffect(() => {
    reset({
      ...defaultFormStateValues,
      ...(initialConditionsState ?? {}),
    });
  }, [initialConditionsState]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialConditionsState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {initialConditionsState?.id
          ? t('people:editCondition')
          : t('people:addCondition')}
      </DialogTitle>

      <Grid
        component="form"
        onSubmit={onSubmit}
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ pb: 3, px: 3 }}
      >
        <Grid item xs={12}>
          <RHFAutocomplete<EditConditionsFormState, string, true>
            fullWidth
            freeSolo
            autoSelect
            label={t('common:name')}
            options={medicalConditionNames?.values ?? []}
            controlProps={{
              name: `name`,
              control,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField<EditConditionsFormState>
            label={t('common:description')}
            controlProps={{
              name: 'description',
              control,
            }}
            textFieldProps={{
              multiline: true,
              rows: 4,
              fullWidth: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <RHFTextField<EditConditionsFormState>
            label={t('people:equipment')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'equipment.0.name',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <RHFTextField<EditConditionsFormState>
            label={t('people:location')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'equipment.0.location',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <DialogActions sx={{ padding: '0!important' }}>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {initialConditionsState?.id
                ? t('people:editCondition')
                : t('people:addCondition')}
            </LoadingButton>
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  );
};
