import {
  CardHeader,
  Chip,
  Grid,
  Card,
  InputAdornment,
  Tooltip,
  Stack,
  Box,
} from '@mui/material';
import {
  RHFTextField,
  RHFCheckbox,
  RHFRadioGroup,
  RHFDatePicker,
  RHFAutocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { FeeType, getColorBasedOnIndex } from '@tyro/api';
import { Control } from 'react-hook-form';
import { InfoCircleIcon } from '@tyro/icons';
import { getDiscountName } from '../../../utils/get-discount-name';
import { FeeFormState } from './types';
import { useDiscounts } from '../../../api/discounts';
import { useFeesCategories } from '../../../api/fees-categories';

type GeneralInformationProps = {
  control: Control<FeeFormState>;
};

export function GeneralInformation({ control }: GeneralInformationProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { data: discountsData = [] } = useDiscounts({});
  const { data: categoriesData = [] } = useFeesCategories({});

  const siblingDiscounts = discountsData.filter(
    ({ siblingDiscount }) => siblingDiscount
  );

  return (
    <Card variant="outlined">
      <CardHeader component="h2" title={t('common:generalInformation')} />
      <Grid container spacing={2} p={3}>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            label={t('common:name')}
            textFieldProps={{
              fullWidth: true,
            }}
            controlProps={{
              name: 'name',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFAutocomplete
            multiple
            label={t('fees:feeCategory')}
            optionIdKey="id"
            optionTextKey="name"
            controlProps={{ name: 'categories', control }}
            options={categoriesData}
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <RHFDatePicker
            label={t('fees:dueDate')}
            controlProps={{ name: 'dueDate', control }}
            inputProps={{ fullWidth: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <RHFTextField
            label={t('fees:amount')}
            textFieldProps={{
              type: 'number',
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              },
            }}
            controlProps={{
              name: 'amount',
              control,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <RHFAutocomplete
            label={t('fees:siblingDiscounts')}
            optionIdKey="id"
            getOptionLabel={getDiscountName}
            controlProps={{ name: 'discounts', control }}
            options={siblingDiscounts}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Tooltip
            title={t('fees:absorbFeesInformation')}
            describeChild
            placement="top-start"
          >
            <Box display="inline">
              <RHFCheckbox
                label={
                  <Stack direction="row" gap={0.5} alignItems="center">
                    {t('fees:absorbFees')}
                    <InfoCircleIcon sx={{ width: 18, height: 18 }} />
                  </Stack>
                }
                controlLabelProps={{ sx: { height: '100%' } }}
                checkboxProps={{ color: 'primary' }}
                controlProps={{
                  name: 'absorbFees',
                  control,
                }}
              />
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
}
