import { Box, Button, InputLabel, Stack, Typography } from '@mui/material';
import { SearchType } from '@tyro/api';
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
import { RecipientsForSmsModal } from '@tyro/sms';
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
  const [recipientTypes] = watch(['recipientTypes']);

  const showComposeModal = useMemo(
    () => possibleRecipientTypes.length > 1,
    [possibleRecipientTypes]
  );

  const getRecipientLabel = (type: SearchType, name: string) => {
    switch (type) {
      case SearchType.GeneralGroupContact:
      case SearchType.SubjectGroupContact:
      case SearchType.YearGroupContact:
        return t('mail:contactOfGroup', { name });
      case SearchType.GeneralGroupStudent:
      case SearchType.SubjectGroupStudent:
      case SearchType.YearGroupStudent:
        return t('mail:studentOfGroup', { name });
      case SearchType.GeneralGroupStaff:
      case SearchType.SubjectGroupStaff:
      case SearchType.YearGroupStaff:
        return t('mail:staffOfGroup', { name });
      case SearchType.YearGroupEnrollment:
        return t('mail:enrollmentOfGroup', { name });
      case SearchType.Staff:
        return t('mail:teachersOfX', { name });
      case SearchType.Student:
        return t('mail:contactsOfStudent', { name });
      case SearchType.Contact:
      case SearchType.CustomGroup:
      case SearchType.GeneralGroup:
      case SearchType.SubjectGroup:
      case SearchType.Room:
      default:
        return name;
    }
  };

  const fullRecipientList = useMemo(
    () =>
      recipients.reduce<NonNullable<NonNullable<ReturnTypeUseMailSearch[]>>>(
        (acc, recipient) => {
          recipientTypes.forEach((recipientType) => {
            acc.push({
              partyId: recipient.id,
              type: recipientType,
              text: getRecipientLabel(recipientType, recipient.name),
              avatarUrl: recipient.avatarUrl,
            });
          });

          return acc;
        },
        []
      ),
    [recipients, recipientTypes]
  );

  const onCancel = () => {
    onClose();
    reset();
  };

  const onSubmit = () => {
    composeEmail({
      canReply: false,
      bccRecipients: fullRecipientList,
    });
    onCancel();
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

  useEffect(() => {
    if (possibleRecipientTypes.length === 1 && isOpen && recipients.length) {
      const recipientType = possibleRecipientTypes[0].type;
      const bccRecipients = recipients.map((recipient) => ({
        partyId: recipient.id,
        type: recipientType,
        text: recipient.name,
        avatarUrl: recipient.avatarUrl,
      }));

      composeEmail({
        canReply: false,
        bccRecipients,
      });
      onCancel();
    }
  }, [isOpen, recipients, possibleRecipientTypes]);

  return showComposeModal ? (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <DialogActions
          sx={{
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
  ) : null;
}
