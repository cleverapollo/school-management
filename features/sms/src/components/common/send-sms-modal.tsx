import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import { RecipientInput, SendSmsInput } from '@tyro/api';
import { RHFCheckboxGroup, RHFTextField, useFormValidator } from '@tyro/core';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSendSms } from '../../api/send-sms';

export type RecipientsForSmsModal = Array<{
  name: string;
  id: RecipientInput['recipientPartyId'];
}>;

interface SendSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientsForSmsModal;
  possibleRecipientTypes: {
    type: RecipientInput['recipientPartyType'];
    label: string;
  }[];
  showRecipientTypes?: boolean;
}

interface SmsFormState {
  recipients: number[];
  recipientTypes: RecipientInput['recipientPartyType'][];
  message: string;
}

const BYTE_SIZE_PER_SMS = 160;
const byteSize = (message: string) => new Blob([message ?? '']).size;

export function SendSmsModal({
  isOpen,
  onClose,
  recipients,
  possibleRecipientTypes,
  showRecipientTypes = true,
}: SendSmsModalProps) {
  const { t } = useTranslation(['common', 'sms']);
  const recipientNames = useMemo(() => {
    const recipientsList = recipients.reduce(
      (acc, recipient) => {
        if (acc.length + recipient.name.length < 30) {
          acc.length += recipient.name.length;
          acc.names.push(recipient.name);
        }
        return acc;
      },
      { length: 0, names: [] as string[] }
    );

    const remainingRecipients = recipients.length - recipientsList.names.length;
    const shownNames = recipientsList.names.join(', ');

    return remainingRecipients > 0
      ? `${shownNames} +${remainingRecipients}`
      : shownNames;
  }, [recipients]);

  const { resolver, rules } = useFormValidator<SmsFormState>();
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SmsFormState>({
    resolver: resolver({
      recipients: rules.required(),
      recipientTypes: rules.required(),
      message: rules.required(),
    }),
    defaultValues: {
      recipientTypes:
        possibleRecipientTypes.length === 1
          ? possibleRecipientTypes.map((recipientType) => recipientType.type)
          : [],
    },
  });

  const { mutateAsync: sendSms, isLoading } = useSendSms();

  const message = watch('message');
  const textCountObject = useMemo(() => {
    const messageByteSize = byteSize(message);

    return {
      count: Math.ceil(messageByteSize / BYTE_SIZE_PER_SMS),
      byteSize: messageByteSize,
      byteSizePerSms: BYTE_SIZE_PER_SMS,
    };
  }, [message]);

  const onCancel = () => {
    onClose();
    reset();
  };

  const onSubmit = (data: SmsFormState) => {
    const fullRecipientList = data.recipients.reduce<
      NonNullable<SendSmsInput['recipients']>
    >((acc, recipient) => {
      data.recipientTypes.forEach((recipientType) => {
        acc.push({
          recipientPartyId: recipient,
          recipientPartyType: recipientType,
        });
      });

      return acc;
    }, []);

    sendSms(
      {
        text: data.message,
        recipients: fullRecipientList,
        canReply: false,
      },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  useEffect(() => {
    const recipientIds = recipients.map((recipient) => recipient.id);
    setValue('recipients', recipientIds);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{t('sms:sendSms')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
          <Box component="dl" m={0}>
            <InputLabel component="dt">Recipients</InputLabel>
            <Typography component="dd" variant="body2" m="0">
              {recipientNames}
            </Typography>
          </Box>

          {showRecipientTypes &&
            (possibleRecipientTypes.length > 1 ? (
              <RHFCheckboxGroup<
                SmsFormState,
                (typeof possibleRecipientTypes)[number]
              >
                label={`${t('sms:sendTo')}:`}
                controlProps={{ name: 'recipientTypes', control }}
                options={possibleRecipientTypes}
                getOptionLabel={(option) => option.label}
                optionIdKey="type"
              />
            ) : (
              <Box component="dl" m={0}>
                <InputLabel component="dt">{t('sms:sendTo')}:</InputLabel>
                <Typography component="dd" variant="body2" m="0">
                  {possibleRecipientTypes[0].label}
                </Typography>
              </Box>
            ))}

          <Box position="relative">
            <RHFTextField<SmsFormState>
              label={t('sms:message')}
              controlProps={{
                name: 'message',
                control,
              }}
              textFieldProps={{
                multiline: true,
                minRows: 4,
                fullWidth: true,
                InputProps: {
                  sx: {
                    pb: 4,
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: errors?.message ? 34 : 8,
                left: 12,
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {t('sms:numberOfTextsAndCharacters', textCountObject)}
            </Typography>
          </Box>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.send')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
