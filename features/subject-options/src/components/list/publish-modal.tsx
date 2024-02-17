import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useFormValidator,
  RHFDatePicker,
  RHFTextField,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ReturnTypeFromUseOptionsSetupList } from '../../api/options';
import { usePublishOptions } from '../../api/publish-options';

interface PublishOptionsModalProps {
  optionsToPublish: ReturnTypeFromUseOptionsSetupList | null;
  open: boolean;
  onClose: () => void;
}

interface PublishFormValues {
  dueDate: Dayjs;
  description: string;
}

export function PublishOptionsModal({
  optionsToPublish,
  open,
  onClose,
}: PublishOptionsModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { resolver, rules } = useFormValidator<PublishFormValues>();

  const { control, handleSubmit, reset } = useForm<PublishFormValues>({
    resolver: resolver({
      dueDate: rules.required(),
      description: rules.required(),
    }),
  });

  const { mutate, isLoading: isPublishing } = usePublishOptions();

  const onPublish = handleSubmit(({ dueDate, description }) => {
    mutate(
      {
        publish: true,
        optionId: optionsToPublish?.id ?? 0,
        dueByDate: dueDate.format('YYYY-MM-DD'),
        description,
      },
      {
        onSuccess: onClose,
      }
    );
  });

  useEffect(() => {
    if (open && optionsToPublish) {
      const { parentsDueByDate, parentsDescription } = optionsToPublish ?? {};
      reset({
        dueDate: parentsDueByDate ? dayjs(parentsDueByDate) : undefined,
        description: parentsDescription ?? '',
      });
    }
  }, [open, optionsToPublish]);

  const isEdit = Boolean(optionsToPublish?.id);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {isEdit
          ? t('subjectOptions:editPublishDetails')
          : t('subjectOptions:publishOptions')}
      </DialogTitle>
      <DialogContent>
        <Stack pt={1} gap={2}>
          <RHFDatePicker
            label={t('common:dueDate')}
            controlProps={{
              control,
              name: 'dueDate',
            }}
            inputProps={{
              fullWidth: true,
            }}
          />
          <RHFTextField
            label={t('common:description')}
            controlProps={{
              name: 'description',
              control,
            }}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              rows: 4,
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="soft" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={isPublishing}
          onClick={onPublish}
        >
          {isEdit ? t('common:actions.save') : t('common:actions.publish')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
