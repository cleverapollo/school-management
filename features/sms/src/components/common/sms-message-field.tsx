import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { RHFTextFieldProps } from '@tyro/core';
import { FieldValues, useController } from 'react-hook-form';
import { forwardRef } from 'react';
import { analyzeSmsTextString } from '../../utils/analyze-sms-text-string';

export const SmsMessageField = forwardRef<JSX.Element, TextFieldProps>(
  (props, ref) => {
    const { value, helperText, InputProps } = props;
    const { t } = useTranslation(['sms']);

    const textCountObject = analyzeSmsTextString(value as string | undefined);

    return (
      <Box position="relative">
        <TextField
          multiline
          fullWidth
          minRows={4}
          {...props}
          inputRef={ref}
          InputProps={{
            ...InputProps,
            sx: {
              ...InputProps?.sx,
              pb: 4,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: helperText ? 34 : 8,
            left: 12,
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          {t('sms:numberOfCharactersWithCharLimitPerSms', textCountObject)}
        </Typography>
      </Box>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  SmsMessageField.displayName = 'SmsMessageField';
}

export const RHFSmsMessageField = <TField extends FieldValues>({
  label,
  textFieldProps,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field,
    fieldState: { error },
  } = useController(controlProps);

  return (
    <SmsMessageField
      {...textFieldProps}
      {...field}
      value={field.value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
    />
  );
};
