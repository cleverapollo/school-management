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
          variant="white-filled"
          optionIdKey="id"
          optionTextKey="value"
          options={(values || []).flatMap((value) => (value ? [value] : []))}
          controlProps={controlProps}
          sx={({ spacing }) => ({
            '& .MuiSelect-select': {
              minWidth: spacing(18),
            },
          })}
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
            sx: ({ spacing }) => ({ mr: 0, height: spacing(6) }),
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
          }}
          controlProps={controlProps}
        />
      );
  }
};
