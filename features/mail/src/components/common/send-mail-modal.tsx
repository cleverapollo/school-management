import { Box, Button, InputLabel, Stack, Typography } from '@mui/material';
import { RecipientInput, SendSmsInput } from '@tyro/api';
import {
  RHFCheckboxGroup,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@tyro/core';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { RecipientList, RecipientsForSmsModal } from '@tyro/sms';

export type { RecipientsForSmsModal } from '@tyro/sms';

interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientsForSmsModal;
  possibleRecipientTypes: {
    type: RecipientInput['recipientPartyType'];
    label: string;
  }[];
  hideRecipientTypes?: boolean;
}

interface MailFormState {
  recipients: RecipientsForSmsModal;
  recipientTypes: RecipientInput['recipientPartyType'][];
  message: string;
}

export function SendMailModal({
  isOpen,
  onClose,
  recipients,
  possibleRecipientTypes,
  hideRecipientTypes = false,
}: SendMailModalProps) {
  const { t } = useTranslation(['common', 'mail']);
  const { resolver, rules } = useFormValidator<MailFormState>();
  const [step, setStep] = useState(0);
  const { reset, control, handleSubmit, setValue, watch } =
    useForm<MailFormState>({
      resolver: resolver({
        recipients: rules.required(),
        recipientTypes: rules.required(),
      }),
      defaultValues: {
        recipients: [],
        recipientTypes:
          possibleRecipientTypes.length === 1
            ? possibleRecipientTypes.map((recipientType) => recipientType.type)
            : [],
      },
    });
  const [recipientList, recipientTypes] = watch([
    'recipients',
    'recipientTypes',
  ]);
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

  const onSubmit = (data: MailFormState) => {
    if (step === 0) {
      setStep((prev) => prev + 1);
    }
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
            <DialogTitle>{t('mail:sendMail')}</DialogTitle>
            <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
              {!hideRecipientTypes &&
                (possibleRecipientTypes.length > 1 ? (
                  <RHFCheckboxGroup<
                    MailFormState,
                    (typeof possibleRecipientTypes)[number]
                  >
                    label={`${t('mail:sendTo')}:`}
                    controlProps={{ name: 'recipientTypes', control }}
                    options={possibleRecipientTypes}
                    getOptionLabel={(option) => option.label}
                    optionIdKey="type"
                  />
                ) : (
                  <Box component="dl" m={0}>
                    <InputLabel component="dt">{t('mail:sendTo')}:</InputLabel>
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

                <Button type="submit" variant="contained">
                  {t('common:actions.next')}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
