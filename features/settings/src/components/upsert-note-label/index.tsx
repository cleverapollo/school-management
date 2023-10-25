import { Button, Stack } from '@mui/material';
import {
  RHFTextField,
  useFormValidator,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { ReturnTypeFromUseNoteTags, useUpsertNoteTags } from '@tyro/people';
import { useEffect } from 'react';

export interface UpsertNoteLabelModalProps {
  noteTags: ReturnTypeFromUseNoteTags[];
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNoteTags> | null;
}

export type UpsertNoteLabelFormState = {
  name: string;
  description: string;
  code: string;
};

export const UpsertNoteLabelModal = ({
  noteTags,
  initialState,
  onClose,
}: UpsertNoteLabelModalProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { resolver, rules } = useFormValidator<UpsertNoteLabelFormState>();
  const currentLanguageCode = i18n.language;

  const defaultFormStateValues: Partial<UpsertNoteLabelFormState> = {
    name: initialState?.name,
    description: initialState?.description || '',
    code: initialState?.tag_l1 || '',
  };

  const { control, handleSubmit, reset } = useForm<UpsertNoteLabelFormState>({
    resolver: resolver({
      name: rules.required(),
      description: rules.required(),
      code: [
        rules.required(),
        rules.isUniqueByKey(
          noteTags.filter((noteTag) => noteTag.id !== initialState?.id),
          'tag_l1',
          t('common:errorMessages.invalidUniqueByKey', { key: 'Code' })
        ),
      ],
    }),
    defaultValues: defaultFormStateValues,
  });

  const { mutate, isLoading } = useUpsertNoteTags();

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    reset(defaultFormStateValues);
  }, [initialState]);

  const onSubmit = (data: UpsertNoteLabelFormState) => {
    mutate(
      [
        {
          id: initialState?.id,
          name: [{ locale: currentLanguageCode, value: data.name }],
          description: [
            { locale: currentLanguageCode, value: data.description },
          ],
          tag_l1: data.code,
        },
      ],
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={!!initialState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialState?.id
          ? t('settings:noteLabel.editNoteLabel')
          : t('settings:noteLabel.createNoteLabel')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <RHFTextField
              label={t('common:name')}
              controlProps={{
                name: 'name',
                control,
              }}
            />
            <RHFTextField
              label={t('settings:noteLabel.code')}
              controlProps={{
                name: 'code',
                control,
              }}
            />
            <RHFTextField
              label={t('common:description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                multiline: true,
                rows: 4,
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {initialState?.id
              ? t('common:actions.edit')
              : t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
