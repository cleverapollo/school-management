import { Box, Button, InputLabel, Stack, Typography } from '@mui/material';
import { RecipientInput, SendSmsInput } from '@tyro/api';
import {
  RHFCheckboxGroup,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@tyro/core';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSendSms } from '../../../api/send-sms';
import { RHFSmsMessageField } from '../sms-message-field';
import { SmsSummary } from '../sms-summary';
import { RecipientList, RecipientsForSmsModal } from './recipient-list';
import { useSmsCostPerMessage } from '../../../api/sms-cost';
import { analyzeSmsTextString } from '../../../utils/analyze-sms-text-string';

export type { RecipientsForSmsModal } from './recipient-list';

interface SendSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientsForSmsModal;
  possibleRecipientTypes: {
    type: RecipientInput['recipientPartyType'];
    label: string;
  }[];
  hideRecipientTypes?: boolean;
}

interface SmsFormState {
  recipients: RecipientsForSmsModal;
  recipientTypes: RecipientInput['recipientPartyType'][];
  message: string;
}

export function SendSmsModal({
  isOpen,
  onClose,
  recipients,
  possibleRecipientTypes,
  hideRecipientTypes = false,
}: SendSmsModalProps) {
  const { t } = useTranslation(['common', 'sms']);
  const { resolver, rules } = useFormValidator<SmsFormState>();
  const { reset, control, handleSubmit, setValue, watch } =
    useForm<SmsFormState>({
      resolver: resolver({
        recipients: rules.required(),
        recipientTypes: rules.required(),
        message: rules.required(),
      }),
      defaultValues: {
        recipients: [],
        recipientTypes:
          possibleRecipientTypes.length === 1
            ? possibleRecipientTypes.map((recipientType) => recipientType.type)
            : [],
      },
    });
  const [recipientList, message, recipientTypes] = watch([
    'recipients',
    'message',
    'recipientTypes',
  ]);
  const { numberOfMessages } = analyzeSmsTextString(message);
  const fullRecipientList = useMemo(
    () =>
      recipientList.reduce<
        NonNullable<NonNullable<SendSmsInput['recipients']>>
      >((acc, recipient) => {
        recipientTypes.forEach((recipientType) => {
          acc.push({
            recipientPartyId: recipient.id,
            recipientPartyType: recipientType,
          });
        });

        return acc;
      }, []),
    [recipientList, recipientTypes]
  );

  const { data: costPerMessage } = useSmsCostPerMessage({
    recipients: fullRecipientList,
  });
  const { mutateAsync: sendSms, isLoading } = useSendSms();

  const removeRecipient = (recipientId: number) => {
    setValue(
      'recipients',
      recipientList.filter((recipient) => recipient.id !== recipientId)
    );
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  const onSubmit = (data: SmsFormState) => {
    sendSms(
      {
        text: data.message,
        recipients: fullRecipientList,
        mobileNumbers: [],
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
    const recipientKeys = new Set<string>();
    const filteredArray = recipients
      .filter(({ id, type }) => {
        const key = `${id}-${type}`;
        const isDuplicateRecipient = recipientKeys.has(key);

        recipientKeys.add(key);
        return !isDuplicateRecipient;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setValue('recipients', filteredArray);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row">
          <Box sx={{ flex: 1.2 }}>
            <DialogTitle>{t('sms:sendSms')}</DialogTitle>
            <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
              <RHFSmsMessageField<SmsFormState>
                label={t('sms:message')}
                controlProps={{
                  name: 'message',
                  control,
                }}
              />

              {!hideRecipientTypes &&
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
            </Stack>
          </Box>
          <RecipientList
            onClose={onClose}
            recipients={recipientList}
            initialRecipientAmount={recipients.length}
            removeRecipient={removeRecipient}
          />
        </Stack>

        <DialogActions
          sx={{
            borderTopColor: 'slate.200',
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            p: '0 !important',
          }}
        >
          <Stack direction="row" sx={{ py: 1.5, flex: 1 }}>
            <Box sx={{ flex: 1.2, display: 'flex', alignItems: 'center' }}>
              <SmsSummary
                sx={{ flex: 1, px: 3 }}
                message={message}
                costPerSms={0.06}
                totalCost={(costPerMessage ?? 0) * numberOfMessages}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1.5}
                sx={{ px: 3, flex: 1 }}
              >
                <Button variant="soft" onClick={onCancel}>
                  {t('common:actions.cancel')}
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                >
                  {t('common:actions.send')}
                </LoadingButton>
              </Stack>
            </Box>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
