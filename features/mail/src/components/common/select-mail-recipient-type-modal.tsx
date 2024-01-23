import { Button, DialogContent } from '@mui/material';
import { RecipientSearchType } from '@tyro/api';
import {
  RHFCheckboxGroup,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@tyro/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';

export type MailRecipientType = {
  type: RecipientSearchType;
  label: string;
};

interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    partyIds: number[],
    selectedTypes: RecipientSearchType[]
  ) => Promise<void>;
  settings?: {
    partyIds: number[];
    possibleRecipientTypes: MailRecipientType[];
  };
}

interface MailFormState {
  recipientTypes: RecipientSearchType[];
}

export function SelectMailRecipientTypeModal({
  isOpen,
  onClose,
  onSubmit,
  settings,
}: SendMailModalProps) {
  const { t } = useTranslation(['common', 'mail']);
  const [isLoading, setIsLoading] = useState(false);
  const { resolver, rules } = useFormValidator<MailFormState>();
  const { reset, control, handleSubmit } = useForm<MailFormState>({
    resolver: resolver({
      recipientTypes: rules.required(),
    }),
  });

  const onCancel = () => {
    onClose();
    reset();
  };

  const onSubmitRequest = handleSubmit(async ({ recipientTypes }) => {
    setIsLoading(true);
    await onSubmit(settings?.partyIds ?? [], recipientTypes);
    setIsLoading(false);
    reset();
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={onSubmitRequest}>
        <DialogTitle>{t('mail:sendMail')}</DialogTitle>
        <DialogContent>
          <RHFCheckboxGroup<MailFormState, MailRecipientType>
            label={`${t('mail:sendTo')}:`}
            controlProps={{ name: 'recipientTypes', control }}
            options={settings?.possibleRecipientTypes ?? []}
            getOptionLabel={(option) => option.label}
            optionIdKey="type"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="soft" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton loading={isLoading} type="submit" variant="contained">
            {t('common:actions.next')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
