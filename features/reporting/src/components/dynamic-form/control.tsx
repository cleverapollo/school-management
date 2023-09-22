import { useTheme } from '@mui/material';
import {
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

type DynamicControlProps<FV extends FieldValues> = {
  control: Control<FV>;
  filter: Reporting_TableFilter;
};

export const DynamicControl = <
  FV extends FieldValues,
  FieldName extends FieldPath<FV>,
  FieldValue extends FieldPathValue<FV, FieldName>
>({
  control,
  filter: { id, inputType, label, defaultValue, values = [] },
}: DynamicControlProps<FV>) => {
  const { palette, spacing } = useTheme();

  const controlProps = {
    name: id as FieldName,
    defaultValue: defaultValue as FieldValue,
    control,
  };

  switch (inputType) {
    case Reporting_TableFilterType.Select:
      return (
        <RHFSelect
          label={label}
          fullWidth
          size="small"
          optionIdKey="id"
          optionTextKey="value"
          options={(values || []).flatMap((value) => (value ? [value] : []))}
          controlProps={controlProps}
          sx={{
            '& .MuiSelect-select': {
              minWidth: spacing(18),
              backgroundColor: palette.background.paper,
            },
          }}
        />
      );
    case Reporting_TableFilterType.Date:
      return (
        <RHFDatePicker
          label={label}
          inputProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
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
            sx: { mr: 0 },
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
          textFieldProps={{
            type:
              inputType === Reporting_TableFilterType.InputNumber
                ? 'number'
                : 'text',
            fullWidth: true,
            size: 'small',
            sx: {
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
            },
          }}
          controlProps={controlProps}
        />
      );
  }
};
