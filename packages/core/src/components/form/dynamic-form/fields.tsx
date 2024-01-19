/* eslint-disable react/prop-types */
import { Control, FieldValues, Path } from 'react-hook-form';
import {
  Forms_FormFieldItem,
  Form_FormFieldItemType,
  Forms_FormFieldGridWidth,
} from '@tyro/api';
import { Grid, Typography } from '@mui/material';
import { useCallback } from 'react';
import { RHFCheckbox } from '../checkbox';
import { RHFDatePicker } from '../date-picker';
import { RHFDateTimePicker } from '../date-time-picker';
import { RHFTextField } from '../text-field';
import { RHFSelect } from '../select';
import { RHFRadioGroup } from '../radio-group';
import { RHFTimePicker } from '../time-picker';

type GridWidth = Omit<
  Record<keyof Forms_FormFieldGridWidth, number>,
  '__typename'
>;

type FieldProps<Fields extends FieldValues> = Omit<
  Forms_FormFieldItem,
  'id'
> & {
  id: Path<Fields>;
  control: Control<Fields, any>;
};

export function getCheckedGridWidth(
  gridWidth: Forms_FormFieldGridWidth
): GridWidth {
  const gridEntries = Object.entries(gridWidth) as [
    keyof Forms_FormFieldGridWidth,
    number | null
  ][];
  const checkedGridWidth = gridEntries.reduce<GridWidth>(
    (acc, [key, value]) => {
      if (key !== '__typename' && value) {
        acc[key] = Math.min(value, 12);
      }
      return acc;
    },
    { xs: 12 } as GridWidth
  );
  return checkedGridWidth;
}

export const Field = <Fields extends FieldValues>({
  id,
  label,
  type,
  options,
  gridWidth,
  control,
}: FieldProps<Fields>) => {
  console.log({
    id,
    label,
    type,
    options,
    gridWidth,
    control,
  });

  const nonBlankLabel = label ?? '';
  const PresetGrid = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      const checkedGridWidth = getCheckedGridWidth(gridWidth);

      return (
        <Grid item {...checkedGridWidth}>
          {children}
        </Grid>
      );
    },
    [gridWidth]
  );

  switch (type) {
    case Form_FormFieldItemType.Checkbox:
      return (
        <PresetGrid>
          <RHFCheckbox
            controlProps={{
              name: id,
              control,
            }}
            label={nonBlankLabel}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Date:
      return (
        <PresetGrid>
          <RHFDatePicker
            controlProps={{
              name: id,
              control,
            }}
            label={nonBlankLabel}
            inputProps={{
              fullWidth: true,
            }}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Datetime:
      return (
        <PresetGrid>
          <RHFDateTimePicker
            controlProps={{
              name: id,
              control,
            }}
            label={nonBlankLabel}
            inputProps={{
              fullWidth: true,
            }}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Input:
      return (
        <PresetGrid>
          <RHFTextField
            controlProps={{
              name: id,
              control,
            }}
            label={nonBlankLabel}
            textFieldProps={{
              fullWidth: true,
            }}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Multiselect:
    case Form_FormFieldItemType.Select:
      return (
        <PresetGrid>
          <RHFSelect
            controlProps={{
              name: id,
              control,
            }}
            label={label}
            options={options}
            optionIdKey="id"
            optionTextKey="name"
            SelectProps={{
              multiple: type === Form_FormFieldItemType.Multiselect,
            }}
            fullWidth
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Paragraph:
      return (
        <PresetGrid>
          <Typography variant="body1">{label}</Typography>
        </PresetGrid>
      );
    case Form_FormFieldItemType.Radio:
      return (
        <PresetGrid>
          <RHFRadioGroup
            controlProps={{
              name: id,
              control,
            }}
            label={nonBlankLabel}
            options={options}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Textarea:
      return (
        <PresetGrid>
          <RHFTextField
            label={nonBlankLabel}
            controlProps={{
              name: id,
              control,
            }}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              rows: 3,
            }}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Time:
      return (
        <PresetGrid>
          <RHFTimePicker
            label={nonBlankLabel}
            controlProps={{
              name: id,
              control,
            }}
            inputProps={{
              fullWidth: true,
            }}
          />
        </PresetGrid>
      );
    default:
      return null;
  }
};
