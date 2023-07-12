import { useEffect } from 'react';
import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { RHFTextField, RHFAutocomplete, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { UpsertStudentMedicalConditionInput } from '@tyro/api';
import { useCreateOrUpdateCondition } from '../../../api/student/medicals/upsert-medical-conditions';
import {
  useMedicalConditionNamesQuery,
  MedicalConditionNamesType,
} from '../../../api/student/medicals/medical-condition-lookup';

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

  const onSubmit = ({
    equipment,
    ...restData
  }: UpsertStudentMedicalConditionInput) => {
    const equipmentValues: UpsertStudentMedicalConditionInput['equipment'] = (
      equipment ?? []
    ).map(({ name, location }) => ({ name, location }));
    const data: UpsertStudentMedicalConditionInput = {
      ...restData,
      equipment: equipmentValues,
      studentPartyId: studentId ?? 0,
    };

    createOrUpdateConditionsMutation(data, {
      onSuccess: onClose,
    });
  };

  useEffect(() => {
    if (initialConditionsState) {
      reset({ ...defaultFormStateValues, ...initialConditionsState });
    }
  }, [initialConditionsState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, onClose]);

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={3}
          sx={{
            p: 3,
          }}
        >
          <RHFAutocomplete<
            EditConditionsFormState,
            MedicalConditionNamesType,
            true
          >
            fullWidth
            freeSolo
            autoSelect
            label={t('common:name')}
            options={medicalConditionNames ?? []}
            optionIdKey="id"
            getOptionLabel={(option) =>
              typeof option !== 'string' ? option.name : option
            }
            controlProps={{
              name: `name`,
              control,
            }}
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
            }}
          />

          <Stack
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: '1fr',
              gap: '16px',
            }}
          >
            <RHFTextField<EditConditionsFormState>
              label="Equipment"
              controlProps={{
                name: 'equipment.0.name',
                control,
              }}
            />
            <RHFTextField<EditConditionsFormState>
              label="Location"
              controlProps={{
                name: 'equipment.0.location',
                control,
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
              {initialConditionsState?.id
                ? t('people:editCondition')
                : t('people:addCondition')}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
};
