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

export interface UpsertNonClassContactModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNoteTagsBehaviour> | null;
}

export type UpsertNonClassContactFormState = {
  name: string;
  description: string;
  behaviourType: Notes_BehaviourType;
};

export const UpsertNonClassContactModal = ({
  initialState,
  onClose,
}: UpsertNonClassContactModalProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { resolver, rules } =
    useFormValidator<UpsertNonClassContactFormState>();
  const currentLanguageCode = i18n.language;

  const defaultFormStateValues: Partial<UpsertNonClassContactFormState> = {
    name: initialState?.name,
    description: initialState?.description || '',
    behaviourType: initialState?.behaviourType || Notes_BehaviourType.Neutral,
  };

  const { control, handleSubmit, reset } =
    useForm<UpsertNonClassContactFormState>({
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
        {t('settings:dtrReturns.createNonClassContact')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFSelect
            fullWidth
            options={[]}
            label={t('common:teacher')}
            getOptionLabel={(option) => option}
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
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
