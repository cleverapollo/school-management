import { useTheme, Stack } from '@mui/material';
import {
  RHFSwitch,
  RHFCheckbox,
  RHFRadioGroup,
  RHFTextField,
  RHFSelect,
  RHFDatePicker,
  RHFDateTimePicker,
  RHFTimePicker,
  RHFAutocomplete,
} from '@tyro/core';
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import {
  ValueEditorProps as RQBValueEditorProps,
  getFirstOption,
  useValueEditor,
  ValueEditorType as RQBValueEditorType,
  Field as RQBField,
} from 'react-querybuilder';
import { Selector } from './selector';

type ValueEditorType =
  | RQBValueEditorType
  | 'autocomplete'
  | 'date'
  | 'datetime'
  | 'time';

export type Field = Omit<RQBField, 'valueEditorType'> & {
  valueEditorType?: ValueEditorType;
};

export type ValueEditorProps<FV extends FieldValues> = Omit<
  RQBValueEditorProps,
  'type' | 'fieldData'
> & {
  control: Control<FV>;
  type?: ValueEditorType;
  fieldData: RQBValueEditorProps['fieldData'] & {
    customProps?: any;
  };
};

export const ValueEditor = <FV extends FieldValues>({
  fieldData,
  operator,
  value,
  handleOnChange,
  type,
  inputType,
  values = [],
  listsAsArrays,
  parseNumbers,
  separator,
  disabled,
  control,
  level,
  path,
  ...propsForValueSelector
}: ValueEditorProps<FV>) => {
  const { palette } = useTheme();

  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange,
    inputType,
    operator,
    value,
    type: type as RQBValueEditorType,
    listsAsArrays,
    parseNumbers,
    values,
  });

  if (operator === 'null' || operator === 'notNull') {
    return <Stack flex={1} />;
  }

  const placeHolderText = fieldData?.placeholder ?? '';
  const fieldName = `fields.${level}${path[0]}.${fieldData.name}`;
  const fieldKey = `${fieldData.name}-${propsForValueSelector.rule.id || ''}`;
  const controlProps = {
    name: fieldName as Path<FV>,
    control,
  };
  const defaultValue = (fieldData.defaultValue ??
    getFirstOption(values)) as PathValue<FV, Path<FV>>;

  const typedValues = values as { name: string; label: string }[];

  const inputTypeCoerced = ['in', 'notIn'].includes(operator)
    ? 'text'
    : inputType || 'text';

  if (
    (operator === 'between' || operator === 'notBetween') &&
    (type === 'select' || type === 'text')
  ) {
    const editors = ['from', 'to'].map((key, i) => {
      if (type === 'text') {
        return (
          <RHFTextField
            key={key}
            textFieldProps={{
              fullWidth: true,
              size: 'small',
              type: inputTypeCoerced,
              sx: {
                flex: 1,
                '& .MuiInputBase-root': {
                  backgroundColor: palette.background.default,
                },
              },
              onChange: (e) => multiValueHandler(e.target.value, i),
            }}
            controlProps={{
              name: `fields.${level}${path[0]}${i}.${fieldData.name}` as Path<FV>,
              control,
            }}
          />
        );
      }

      return (
        <Selector
          {...propsForValueSelector}
          key={key}
          level={level}
          path={path}
          disabled={disabled}
          handleOnChange={(v) => multiValueHandler(v, i)}
          value={valueAsArray[i] ?? getFirstOption(values)}
          options={typedValues}
          listsAsArrays={listsAsArrays}
        />
      );
    });

    return (
      <Stack flex={1} flexDirection="row" gap={2}>
        {editors[0]}
        {separator}
        {editors[1]}
      </Stack>
    );
  }

  switch (type) {
    case 'select':
      return (
        <RHFSelect
          fullWidth
          size="small"
          optionIdKey="name"
          optionTextKey="label"
          options={typedValues}
          controlProps={controlProps}
          sx={{
            flex: 1,
            '& .MuiSelect-select': {
              backgroundColor: palette.background.paper,
            },
          }}
          onChange={(e) => handleOnChange(e.target.value)}
        />
      );
    case 'multiselect':
      return (
        <Stack flex={1} flexDirection="row">
          <Selector
            {...propsForValueSelector}
            level={level}
            path={path}
            handleOnChange={handleOnChange}
            options={typedValues}
            value={value}
            disabled={disabled}
            multiple
            listsAsArrays={listsAsArrays}
            sx={{
              flex: 1,
              width: '100%',
              whiteSpace: 'pre-wrap',
            }}
          />
        </Stack>
      );

    case 'switch':
      return (
        <Stack flex={1} flexDirection="row">
          <RHFSwitch
            switchProps={{
              disabled,
              onChange: (e) => handleOnChange(e.target.value),
            }}
            controlProps={controlProps}
          />
        </Stack>
      );

    case 'checkbox':
      return (
        <Stack flex={1} flexDirection="row">
          <RHFCheckbox
            checkboxProps={{
              disabled,
              onChange: (e) => handleOnChange(e.target.checked),
            }}
            controlProps={controlProps}
          />
        </Stack>
      );

    case 'radio':
      return (
        <RHFRadioGroup
          radioGroupProps={{
            row: true,
            sx: { flex: 1 },
            onChange: (e) => handleOnChange(e.target.value),
          }}
          optionIdKey="name"
          options={values}
          controlProps={{
            ...controlProps,
            defaultValue,
          }}
        />
      );
    case 'autocomplete':
      return (
        <RHFAutocomplete
          optionIdKey="name"
          optionTextKey="label"
          options={values}
          controlProps={controlProps}
          size="small"
          sx={{
            flex: 1,
          }}
          inputProps={{
            fullWidth: true,
            sx: {
              flex: 1,
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
            },
          }}
          onChange={(_e, newValue) => handleOnChange(newValue)}
          {...fieldData?.customProps}
        />
      );
    case 'date':
      return (
        <RHFDatePicker
          inputProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              flex: 1,
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
            },
            onChange: (e) => handleOnChange(e.target.value),
          }}
          controlProps={controlProps}
        />
      );
    case 'datetime':
      return (
        <RHFDateTimePicker
          inputProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              flex: 1,
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
            },
            onChange: (e) => handleOnChange(e.target.value),
          }}
          controlProps={controlProps}
        />
      );
    case 'time':
      return (
        <RHFTimePicker
          inputProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              flex: 1,
              '& .MuiInputBase-root': {
                backgroundColor: palette.background.default,
              },
            },
            onChange: (e) => handleOnChange(e.target.value),
          }}
          controlProps={controlProps}
        />
      );
    case 'textarea':
    default: {
      return (
        <Stack flex={1} flexDirection="row">
          <RHFTextField
            key={fieldKey}
            textFieldProps={{
              type: inputTypeCoerced,
              fullWidth: true,
              size: 'small',
              ...(type === 'textarea' && {
                multiline: true,
                rows: 2,
              }),
              sx: {
                flex: 1,
                '& .MuiInputBase-root': {
                  backgroundColor: palette.background.default,
                },
              },
              onChange: (e) => handleOnChange(e.target.value),
            }}
            controlProps={controlProps}
          />
        </Stack>
      );
    }
  }
};
