import { useEffect } from 'react';
import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  UpsertStudentMedicalConditionInput,
  UpsertStudentMedicalConditionEquipmentInput,
} from '@tyro/api';
import { useCreateOrUpdateCondition } from '../../../api/student/medicals/upsert-medical-conditions';
import { ReturnTypeFromUseStudentMedical } from './conditions-table';

export type EditConditionsFormState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment' | 'studentPartyId'
>;

export type EditConditionsProps = {
  studentId: number | undefined;
  initialConditionsState?: Partial<EditConditionsFormState> | null;
  conditions: ReturnTypeFromUseStudentMedical[];
  onClose: () => void;
};

export const EditConditionsModal = ({
  studentId,
  initialConditionsState,
  conditions,
  onClose,
}: EditConditionsProps) => {
  const { t } = useTranslation(['settings', 'people', 'common']);

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
    const transformedEquipment: UpsertStudentMedicalConditionEquipmentInput[] =
      (equipment ?? []).map(({ name, location }) => ({ name, location }));

    const transformedData: UpsertStudentMedicalConditionInput = {
      ...restData,
      equipment: transformedEquipment,
      studentPartyId: studentId ?? 0,
    };

    createOrUpdateConditionsMutation(transformedData, {
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
          <RHFTextField<EditConditionsFormState>
            label={t('common:name')}
            controlProps={{
              name: 'name',
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
