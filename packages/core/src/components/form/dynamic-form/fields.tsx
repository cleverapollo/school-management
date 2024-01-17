import { Control, FieldValues, Path } from 'react-hook-form';
import { Forms_FormFieldItem, Form_FormFieldItemType } from '@tyro/api';
import { Grid, Typography, GridSize } from '@mui/material';
import { useCallback } from 'react';
import { RHFCheckbox } from '../checkbox';
import { RHFDatePicker } from '../date-picker';
import { RHFDateTimePicker } from '../date-time-picker';
import { RHFTextField } from '../text-field';
import { RHFSelect } from '../select';
import { RHFRadioGroup } from '../radio-group';

interface FieldProps<Fields extends FieldValues>
  extends Omit<Forms_FormFieldItem, 'id'> {
  id: Path<Fields>;
  control: Control<Fields, any>;
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
  const PresetGrid = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <Grid item xs={12} {...(gridWidth ?? {})}>
        {children}
      </Grid>
    ),
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            multiple={type === Form_FormFieldItemType.Multiselect}
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
            label={label}
            options={options}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Textarea:
      return (
        <PresetGrid>
          <RHFTextField
            controlProps={{
              name: id,
              control,
            }}
            label={label}
            multiline
            minRows={3}
            textFieldProps={{
              fullWidth: true,
            }}
          />
        </PresetGrid>
      );
    case Form_FormFieldItemType.Time:
      return (
        <PresetGrid>
          <RHFDateTimePicker
            controlProps={{
              name: id,
              control,
            }}
            label={label}
            timeOnly
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
