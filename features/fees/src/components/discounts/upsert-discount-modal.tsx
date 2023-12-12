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

type DiscountFormState = {
  name: string;
  description: string;
  discountType: DiscountType;
  siblingDiscount: boolean;
  value: number;
};

const discountTypeAdornment = {
  [DiscountType.Fixed]: '£',
  [DiscountType.Percentage]: '%',
};

export type UpsertDiscountModalProps = {
  open: boolean;
  value: Partial<DiscountFormState> | null;
  onClose: () => void;
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
      value: rules.required(),
    }),
  });

  const onSubmit = handleSubmit((discountData) =>
    saveDiscount(discountData, {
      onSuccess: onClose,
    })
  );

  const discountType = watch('discountType');

  useEffect(() => {
    reset({ ...value });
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
          <Stack gap={3} mt={1}>
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
