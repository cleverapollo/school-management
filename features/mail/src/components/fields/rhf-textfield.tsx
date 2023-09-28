import { RHFTextField } from '@tyro/core';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type RHFTextFieldProps<TField extends FieldValues> = {
  label?: string;
  controlProps: UseControllerProps<TField>;
};

export const EditorRHFTextfield = <TField extends FieldValues>({
  label,
  controlProps,
}: RHFTextFieldProps<TField>) => (
  <RHFTextField
    label={label}
    variant="standard"
    textFieldProps={{
      InputProps: {
        disableUnderline: true,
      },
      InputLabelProps: {
        shrink: true,
        sx: {
          visibility: 'hidden',
          width: 0,
          height: 0,
        },
      },
      sx: (theme) => ({
        padding: theme.spacing(0.5, 3),
        borderBottom: `solid 1px ${theme.palette.divider}`,
        '& .MuiInputBase-root': {
          mt: 0,
        },
      }),
      placeholder: label,
    }}
    controlProps={controlProps}
  />
);

if (process.env.NODE_ENV !== 'production') {
  EditorRHFTextfield.displayName = 'EditorRHFTextfield';
}
