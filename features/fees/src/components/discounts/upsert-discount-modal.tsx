import { LoadingButton } from '@mui/lab';
import { Button, InputAdornment, Stack } from '@mui/material';
import {
  RHFTextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useFormValidator,
  RHFCheckbox,
  RHFRadioGroup,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { DiscountType } from '@tyro/api';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSaveDiscount } from '../../api/save-discount';
import { ReturnTypeFromUseDiscounts } from '../../api/discounts';

type DiscountFormState = {
  name: string;
  description?: string | null;
  discountType: DiscountType;
  siblingDiscount?: boolean | null;
  active?: boolean | null;
  value: number;
};

const discountTypeAdornment = {
  [DiscountType.Fixed]: '€',
  [DiscountType.Percentage]: '%',
};

export type UpsertDiscountModalProps = {
  open: boolean;
  value: Partial<ReturnTypeFromUseDiscounts> | null;
  onClose: () => void;
};

const MIN_VALUES_ALLOWED = {
  [DiscountType.Fixed]: 0.5,
  [DiscountType.Percentage]: 0.1,
};

const MAX_VALUES_ALLOWED = {
  [DiscountType.Fixed]: undefined,
  [DiscountType.Percentage]: 100,
};

const defaultValues: Partial<DiscountFormState> = {
  active: true,
};

export function UpsertDiscountModal({
  open,
  value,
  onClose,
}: UpsertDiscountModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { mutateAsync: saveDiscount, isLoading } = useSaveDiscount();
  const { resolver, rules } = useFormValidator<DiscountFormState>();
  const { control, handleSubmit, reset, watch } = useForm<DiscountFormState>({
    resolver: resolver({
      name: rules.required(),
      discountType: rules.required(),
      value: [
        rules.required(),
        rules.isNumber(),
        rules.validate((fieldValue, throwError, formValues) => {
          const currentDiscountType = formValues.discountType;
          const currentValue = fieldValue ?? 0;
          const minValue = MIN_VALUES_ALLOWED[currentDiscountType];
          const maxValue = MAX_VALUES_ALLOWED[currentDiscountType];

          if (currentValue < minValue) {
            throwError(t('common:errorMessages.min', { number: minValue }));
          }

          if (maxValue && currentValue > maxValue) {
            throwError(t('common:errorMessages.max', { number: maxValue }));
          }
        }),
      ],
    }),
    defaultValues,
  });

  const onSubmit = handleSubmit((discountData) =>
    saveDiscount(discountData, {
      onSuccess: onClose,
    })
  );

  const discountType = watch('discountType');

  useEffect(() => {
    reset({ ...defaultValues, ...value });
  }, [value]);

  return (
    <Dialog
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="xs"
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {t(`fees:${value?.name ? 'editDiscount' : 'createDiscount'}`)}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <RHFTextField
              label={t('common:name')}
              controlProps={{
                name: 'name',
                control,
              }}
            />

            <RHFTextField
              label={t('common:description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                rows: 3,
              }}
            />

            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('fees:discountType')}
              options={[DiscountType.Fixed, DiscountType.Percentage].map(
                (option) => ({
                  value: option,
                  label: t(`fees:discountsType.${option}`),
                })
              )}
              controlProps={{
                name: 'discountType',
                control,
              }}
            />

            <RHFTextField
              label={t('fees:value')}
              textFieldProps={{
                type: 'number',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {discountTypeAdornment[discountType]}
                    </InputAdornment>
                  ),
                },
              }}
              controlProps={{
                name: 'value',
                control,
              }}
            />

            <RHFCheckbox
              label={t('fees:isSiblingDiscount')}
              checkboxProps={{ color: 'primary' }}
              controlProps={{
                name: 'siblingDiscount',
                control,
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
