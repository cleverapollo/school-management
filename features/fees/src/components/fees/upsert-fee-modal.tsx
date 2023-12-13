import { LoadingButton } from '@mui/lab';
import { Button, Chip, Stack } from '@mui/material';
import {
  RHFTextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useFormValidator,
  RHFCheckbox,
  RHFRadioGroup,
  RHFDatePicker,
  RHFAutocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { FeeType, getColorBasedOnIndex } from '@tyro/api';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useSaveFee } from '../../api/save-fees';
import { ReturnTypeFromUseFees } from '../../api/fees';
import { ReturnTypeFromUseDiscounts, useDiscounts } from '../../api/discounts';

type FeeFormState = {
  name: string;
  dueDate: dayjs.Dayjs;
  amount: number;
  feeType: FeeType;
  absorbFees: boolean;
  discounts: ReturnTypeFromUseDiscounts[];
};

export type UpsertFeeModalProps = {
  open: boolean;
  value: Partial<ReturnTypeFromUseFees> | null;
  onClose: () => void;
};

export function UpsertFeeModal({ open, value, onClose }: UpsertFeeModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { mutateAsync: saveFee, isLoading } = useSaveFee();
  const { data: discountsData = [] } = useDiscounts({});

  const { resolver, rules } = useFormValidator<FeeFormState>();
  const { control, handleSubmit, reset } = useForm<FeeFormState>({
    resolver: resolver({
      name: rules.required(),
      dueDate: [rules.required(), rules.date()],
      amount: [rules.required(), rules.isNumber()],
      feeType: rules.required(),
    }),
  });

  const onSubmit = handleSubmit(({ dueDate, amount, discounts, ...feeData }) =>
    saveFee(
      {
        ...feeData,
        amount: Number(amount),
        dueDate: dueDate.format('YYYY-MM-DD'),
        discountIds: discounts.map(({ id }) => id),
      },
      {
        onSuccess: onClose,
      }
    )
  );

  useEffect(() => {
    const { dueDate, discounts } = value || {};

    reset({
      ...value,
      discounts: discounts || [],
      dueDate: dueDate ? dayjs(dueDate) : undefined,
    });
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
          {t(`fees:${value?.name ? 'editFee' : 'createFee'}`)}
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

            <RHFDatePicker
              label={t('fees:dueDate')}
              controlProps={{ name: 'dueDate', control }}
              inputProps={{ fullWidth: true }}
            />

            <RHFTextField
              label={t('fees:amount')}
              textFieldProps={{
                type: 'number',
              }}
              controlProps={{
                name: 'amount',
                control,
              }}
            />

            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('fees:feeType')}
              options={[FeeType.Mandatory, FeeType.Voluntary].map((option) => ({
                value: option,
                label: t(`fees:feesType.${option}`),
              }))}
              controlProps={{
                name: 'feeType',
                control,
              }}
            />

            <RHFAutocomplete
              multiple
              label={t('fees:discounts')}
              optionIdKey="id"
              optionTextKey="name"
              controlProps={{ name: 'discounts', control }}
              options={discountsData}
              renderTags={(tags, getTagProps) =>
                tags.map((tag, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    size="small"
                    variant="soft"
                    color={getColorBasedOnIndex(tag.id)}
                    label={tag.name}
                  />
                ))
              }
            />

            <RHFCheckbox
              label={t('fees:absorbFees')}
              checkboxProps={{ color: 'primary' }}
              controlProps={{
                name: 'absorbFees',
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
