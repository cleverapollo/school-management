import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseNoteTagsBehaviour,
  useUpsertBehaviourTags,
} from '@tyro/people';
import React, { useEffect } from 'react';
import { Notes_BehaviourType } from '@tyro/api';

export interface UpsertBehaviourLabelModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNoteTagsBehaviour> | null;
}

export type UpsertBehaviourLabelFormState = {
  name: string;
  description: string;
  behaviourType: Notes_BehaviourType;
};

export const UpsertBehaviourLabelModal = ({
  initialState,
  onClose,
}: UpsertBehaviourLabelModalProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { resolver, rules } = useFormValidator<UpsertBehaviourLabelFormState>();
  const currentLanguageCode = i18n.language;

  const defaultFormStateValues: Partial<UpsertBehaviourLabelFormState> = {
    name: initialState?.name,
    description: initialState?.description || '',
    behaviourType: initialState?.behaviourType || Notes_BehaviourType.Neutral,
  };

  const { control, handleSubmit, reset } =
    useForm<UpsertBehaviourLabelFormState>({
      resolver: resolver({
        name: rules.required(),
        behaviourType: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
    });

  const { mutate, isLoading } = useUpsertBehaviourTags();

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    reset(defaultFormStateValues);
  }, [initialState]);

  const onSubmit = handleSubmit((data) => {
    mutate(
      [
        {
          id: initialState?.id,
          tag_l2: initialState?.tag_l2 || '',
          name: [{ locale: currentLanguageCode, value: data.name }],
          description: [
            { locale: currentLanguageCode, value: data.description },
          ],
          behaviourType: data.behaviourType,
        },
      ],
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  });

  return (
    <Dialog
      open={!!initialState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialState?.id
          ? t('settings:behaviourLabel.editBehaviourLabel')
          : t('settings:behaviourLabel.createBehaviourLabel')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            label={t('common:name')}
            controlProps={{
              name: 'name',
              control,
            }}
          />
          <RHFSelect
            fullWidth
            options={Object.values(Notes_BehaviourType)}
            label={t('settings:behaviourLabel.reportAs')}
            getOptionLabel={(option) => t(`common:behaviourType.${option}`)}
            controlProps={{
              name: 'behaviourType',
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
