import { Box, Button, InputLabel, Stack, Typography } from '@mui/material';
import { SearchType } from '@tyro/api';
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
import { useMailSettings } from '../../store/mail-settings';
import { ReturnTypeUseMailSearch } from '../../api/mail-search';

export type { RecipientsForSmsModal } from '@tyro/sms';

interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientsForSmsModal;
  possibleRecipientTypes: {
    type: SearchType;
    label: string;
  }[];
  hideRecipientTypes?: boolean;
}

interface MailFormState {
  recipients: RecipientsForSmsModal;
  recipientTypes: SearchType[];
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
  const { composeEmail } = useMailSettings();
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

  const showComposeStep = useMemo(
    () => possibleRecipientTypes.length > 1,
    [possibleRecipientTypes]
  );

  const fullRecipientList = useMemo(
    () =>
      recipientList.reduce<NonNullable<NonNullable<ReturnTypeUseMailSearch[]>>>(
        (acc, recipient) => {
          recipientTypes.forEach((recipientType) => {
            acc.push({
              partyId: recipient.id,
              type: recipientType,
              text: recipient.name,
              avatarUrl: recipient.avatarUrl,
            });
          });

          return acc;
        },
        []
      ),
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
    setStep(0);
    reset();
  };

  const onSubmit = () => {
    if (step === 0 && showComposeStep) {
      setStep((prev) => prev + 1);
    } else {
      composeEmail({
        canReply: false,
        bccRecipients: fullRecipientList,
      });
      onCancel();
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

  const recipientListContent = (
    <RecipientList
      onClose={onClose}
      recipients={recipientList}
      initialRecipientAmount={recipients.length}
      removeRecipient={removeRecipient}
    />
  );

  const recipientTypesContent = (
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
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t('mail:sendMail')}</DialogTitle>
        {step === 0 && recipientListContent}
        {step === 1 && showComposeStep && recipientTypesContent}
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
                  {step === 0 && showComposeStep
                    ? t('common:actions.next')
                    : t('common:actions.send')}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
