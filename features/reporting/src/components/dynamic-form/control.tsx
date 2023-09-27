import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from '@tyro/core';
import { Reporting_TableFilter, Reporting_TableFilterType } from '@tyro/api';
import {
  Control,
  FieldValues,
  FieldPathValue,
  FieldPath,
} from 'react-hook-form';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';

type DynamicControlProps<FV extends FieldValues> = {
  control: Control<FV>;
  filter: Omit<Reporting_TableFilter, 'defaultValue'> & {
    defaultValue?: FieldPathValue<FV, FieldPath<FV>>;
  };
};

export const DynamicControl = <
  FV extends FieldValues,
  FieldName extends FieldPath<FV>,
  FieldValue extends FieldPathValue<FV, FieldName>
>({
  control,
  filter: { id, inputType, label, defaultValue, values = [] },
}: DynamicControlProps<FV>) => {
  const { spacing } = useTheme();

  const controlProps = {
    name: id as FieldName,
    ...(defaultValue && { defaultValue }),
    control,
  };

  const minWidth = spacing(32);

  const options = useMemo(
    () => (values || []).flatMap((value) => (value ? [value] : [])),
    [values]
  );

  switch (inputType) {
    case Reporting_TableFilterType.Select:
      return (
        <RHFSelect
          label={label}
          fullWidth
          size="small"
          variant="white-filled"
          optionIdKey="id"
          optionTextKey="value"
          options={options}
          controlProps={controlProps}
          sx={{
            '& .MuiSelect-select': {
              minWidth,
            },
          }}
        />
      );
    case Reporting_TableFilterType.MultiSelect:
      return (
        <RHFAutocomplete
          label={label}
          fullWidth
          multiple
          size="small"
          optionIdKey="id"
          optionTextKey="value"
          options={options}
          inputProps={{
            variant: 'white-filled',
          }}
          limitTags={2}
          disableCloseOnSelect
          sx={{
            minWidth,
            maxWidth: spacing(66),
          }}
          controlProps={controlProps}
        />
      );
    case Reporting_TableFilterType.Date:
      return (
        <RHFDatePicker
          label={label}
          inputProps={{
            size: 'small',
            fullWidth: true,
            variant: 'white-filled',
            sx: {
              minWidth,
            },
          }}
          controlProps={{
            ...controlProps,
            defaultValue: dayjs(controlProps.defaultValue) as FieldValue,
          }}
        />
      );
    case Reporting_TableFilterType.Checkbox:
      return (
        <RHFCheckbox
          label={label}
          controlLabelProps={{
            sx: { mr: 0, height: spacing(6) },
          }}
          controlProps={controlProps}
        />
      );
    case Reporting_TableFilterType.Input:
    case Reporting_TableFilterType.InputNumber:
    default:
      return (
        <RHFTextField
          label={label}
          variant="white-filled"
          textFieldProps={{
            type:
              inputType === Reporting_TableFilterType.InputNumber
                ? 'number'
                : 'text',
            fullWidth: true,
            size: 'small',
            sx: {
              minWidth,
            },
          }}
          controlProps={controlProps}
        />
      );
  }
};
