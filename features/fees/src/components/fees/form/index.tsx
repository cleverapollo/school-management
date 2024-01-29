import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { ConfirmDialog, useDisclosure, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveFee } from '../../../api/save-fees';
import { FeeFormState } from './types';
import { GeneralInformation } from './general-information';
import { AddStudents } from './add-students';

export type FeeFormProps = {
  initialState?: Partial<FeeFormState>;
};

const defaultFormStateValues: Partial<FeeFormState> = {
  categories: [],
  students: [],
  individualDiscounts: [],
};

export function FeeForm({ initialState }: FeeFormProps) {
  const { t } = useTranslation(['common', 'fees']);

  const navigate = useNavigate();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { mutateAsync: saveFee, isLoading } = useSaveFee();

  const { resolver, rules } = useFormValidator<FeeFormState>();
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm<FeeFormState>({
    resolver: resolver({
      name: rules.required(),
      categories: rules.required(),
      dueDate: [rules.required(), rules.date()],
      amount: [rules.required(), rules.isNumber()],
      feeType: rules.required(),
    }),
    defaultValues: defaultFormStateValues,
  });

  const goBack = () => {
    navigate('/fees/overview');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onOpenCancelModal();
    } else {
      goBack();
    }
  };

  useEffect(() => {
    if (initialState) {
      reset({
        ...defaultFormStateValues,
        ...initialState,
      });
    }
  }, [initialState]);

  const onSubmit = handleSubmit(
    ({
      students,
      dueDate,
      amount,
      discounts,
      categories,
      individualDiscounts,
      ...feeData
    }) =>
      saveFee(
        {
          ...feeData,
          amount: Number(amount),
          dueDate: dueDate.format('YYYY-MM-DD'),
          categoryIds: categories.map(({ id }) => id),
          discountIds: discounts ? [discounts.id] : [],
          assignedToPartyIds: students.map(({ partyId }) => partyId),
          individualDiscounts: individualDiscounts.map(({ partyId, id }) => ({
            partyId,
            discountId: id,
          })),
        },
        {
          onSuccess: goBack,
        }
      )
  );

  return (
    <Grid container gap={3} component="form" onSubmit={onSubmit}>
      <Grid item xs={12} lg={10}>
        <GeneralInformation control={control} />
      </Grid>

      <Grid item xs={12} lg={10}>
        <AddStudents
          control={control}
          setFocus={setFocus}
          setValue={setValue}
          getValues={getValues}
        />
      </Grid>

      <Grid item xs={12} lg={10}>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button
            variant="soft"
            size="large"
            color="primary"
            disabled={isLoading}
            onClick={handleCancelForm}
          >
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            size="large"
            type="submit"
          >
            {t('common:actions.save')}
          </LoadingButton>
        </Stack>
      </Grid>
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCloseCancelModal}
        onConfirm={goBack}
      />
    </Grid>
  );
}
