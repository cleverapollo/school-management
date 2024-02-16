import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useFormValidator,
  RHFTextField,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCloneOptions } from '../../api/clone-options';
import { ReturnTypeFromUseOptionsSetupList } from '../../api/options';

interface CloneOptionsModalProps {
  optionsToClone: ReturnTypeFromUseOptionsSetupList | null;
  currentOptionsList: ReturnTypeFromUseOptionsSetupList[];
  open: boolean;
  onClose: () => void;
}

interface CloneFormValues {
  newName: string;
}

export function CloneOptionsModal({
  optionsToClone,
  currentOptionsList,
  open,
  onClose,
}: CloneOptionsModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { resolver, rules } = useFormValidator<CloneFormValues>();

  const { control, handleSubmit, reset } = useForm<CloneFormValues>({
    resolver: resolver({
      newName: [
        rules.required(),
        rules.isUniqueByKey(
          currentOptionsList,
          'name',
          t('subjectOptions:optionsNameMustBeUnique')
        ),
      ],
    }),
  });

  const { mutate, isLoading: isSaving } = useCloneOptions();

  const onPublish = handleSubmit(({ newName }) => {
    mutate(
      {
        optionId: optionsToClone?.id ?? 0,
        name: newName,
      },
      {
        onSuccess: onClose,
      }
    );
  });

  useEffect(() => {
    if (open && optionsToClone) {
      const { name } = optionsToClone ?? {};
      const copyString = t('common:actions.copy', { defaultValue: 'Copy' });
      reset({
        newName: `${name} - ${copyString}`,
      });
    }
  }, [open, optionsToClone]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('subjectOptions:cloneOptions')}
      </DialogTitle>
      <DialogContent>
        <Stack pt={1} gap={2}>
          <RHFTextField
            label={t('common:name')}
            controlProps={{
              name: 'newName',
              control,
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
          loading={isSaving}
          onClick={onPublish}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
