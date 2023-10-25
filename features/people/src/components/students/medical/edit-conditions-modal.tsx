import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import {
  RHFTextField,
  RHFAutocomplete,
  useFormValidator,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
} from '@tyro/core';
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
    const equipmentValue = (equipment ?? [])
      .map(({ name, location }) => ({
        name,
        location,
      }))
      .filter((a) => a.name !== undefined);
    createOrUpdateConditionsMutation(
      {
        ...restData,
        equipment: equipmentValue,
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
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialConditionsState?.id
          ? t('people:editCondition')
          : t('people:addCondition')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
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
              sx={{ mt: 1 }}
            />
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField<EditConditionsFormState>
                label={t('people:equipment')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'equipment.0.name',
                  control,
                }}
              />
              <RHFTextField<EditConditionsFormState>
                label={t('people:location')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'equipment.0.location',
                  control,
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
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
      </form>
    </Dialog>
  );
};
