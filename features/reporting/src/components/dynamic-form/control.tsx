import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from '@tyro/core';
import {
  Reporting_TableFilter,
  Reporting_TableFilterType,
  Reporting_TableFilterValues,
} from '@tyro/api';
import {
  Control,
  FieldValues,
  FieldPathValue,
  FieldPath,
} from 'react-hook-form';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import dayjs from 'dayjs';

type DynamicControlProps<FV extends FieldValues> = {
  control: Control<FV>;
  filter: Omit<Reporting_TableFilter, 'defaultValue'> & {
    defaultValue?: FieldPathValue<FV, FieldPath<FV>>;
  };
};

const getDefaultValueFormat = (
  defaultValue: any,
  values: Reporting_TableFilterValues[],
  inputType: Reporting_TableFilterType
) => {
  switch (inputType) {
    case Reporting_TableFilterType.Checkbox:
      return Boolean(defaultValue);
    case Reporting_TableFilterType.MultiSelect: {
      const defaultIdValues = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];

      return values.filter((value) =>
        defaultIdValues.includes(value.id as number)
      );
    }
    case Reporting_TableFilterType.Select:
      return defaultValue?.id as number;
    case Reporting_TableFilterType.Date:
      return dayjs(defaultValue as dayjs.Dayjs);
    case Reporting_TableFilterType.InputNumber:
      return Number(defaultValue);
    case Reporting_TableFilterType.Input:
    default:
      return String(defaultValue);
  }
};

export const DynamicControl = <
  FV extends FieldValues,
  FieldName extends FieldPath<FV>,
  FieldValue extends FieldPathValue<FV, FieldName>
>({
  control,
  filter: {
    id,
    inputType,
    label,
    defaultValue,
    values = [],
    minValue,
    maxValue,
  },
}: DynamicControlProps<FV>) => {
  const { spacing } = useTheme();

  const options = useMemo(
    () => (values || []).flatMap((value) => (value ? [value] : [])),
    [values]
  );

  const controlProps = {
    name: id as FieldName,
    ...(defaultValue && {
      defaultValue: getDefaultValueFormat(
        defaultValue,
        options,
        inputType
      ) as FieldValue,
    }),
    control,
  };

  const minWidth = spacing(32);

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
          datePickerProps={{
            minDate: minValue ? dayjs(minValue as string) : undefined,
            maxDate: maxValue ? dayjs(maxValue as string) : undefined,
          }}
          controlProps={controlProps}
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
