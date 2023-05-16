import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { RHFTextFieldProps } from '@tyro/core';
import { FieldValues, useController } from 'react-hook-form';
import { useMemo } from 'react';

const BYTE_SIZE_PER_SMS = 160;
const getByteSize = (message: unknown) =>
  typeof message === 'string' ? new Blob([message ?? '']).size : 0;

export function SmsMessageField(props: TextFieldProps) {
  const { value, helperText, InputProps } = props;
  const { t } = useTranslation(['sms']);

  const textCountObject = useMemo(() => {
    const messageByteSize = getByteSize(value);

    return {
      count: Math.ceil(messageByteSize / BYTE_SIZE_PER_SMS),
      byteSize: messageByteSize,
      byteSizePerSms: BYTE_SIZE_PER_SMS,
    };
  }, [value]);

  return (
    <Box position="relative">
      <TextField
        label={t('sms:message')}
        multiline
        fullWidth
        minRows={4}
        {...props}
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
        {t('sms:numberOfTextsAndCharacters', textCountObject)}
      </Typography>
    </Box>
  );
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
