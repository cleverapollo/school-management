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
import { Colour, Notes_BehaviourType } from '@tyro/api';
import React from 'react';
import { useUpsertBehaviourCategory } from '@tyro/people/src/api/behaviour/upsert-behaviour-category';

type MockReturnTypeFromCategory = {
  name: string;
  description?: string | null | undefined;
  id: number;
};

export interface UpsertCategoryModalProps {
  onClose: () => void;
  initialState: Partial<MockReturnTypeFromCategory> | null;
}

export type UpsertCategoryFormState = {
  behaviourType: Notes_BehaviourType;
  name: string;
  description: string;
};

const codeTypeColorMapping = {
  [Notes_BehaviourType.Positive]: Colour.Green,
  [Notes_BehaviourType.Negative]: Colour.Rose,
  [Notes_BehaviourType.Neutral]: Colour.Blue,
};

export const UpsertCategoryModal = ({
  initialState,
  onClose,
}: UpsertCategoryModalProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { resolver, rules } = useFormValidator<UpsertCategoryFormState>();
  const { mutate, isLoading } = useUpsertBehaviourCategory();

  const defaultFormStateValues: Partial<UpsertCategoryFormState> = {
    behaviourType: Notes_BehaviourType.Neutral,
    name: initialState?.name,
    description: initialState?.description || '',
  };

  const { control, handleSubmit, reset } = useForm<UpsertCategoryFormState>({
    resolver: resolver({
      behaviourType: rules.required(),
      name: rules.required(),
    }),
    defaultValues: defaultFormStateValues,
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        name: data.name,
        description: data.description,
        behaviourType: data.behaviourType,
        colour: codeTypeColorMapping[data.behaviourType],
      },
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
          ? t('settings:category.editCategory')
          : t('settings:category.createCategory')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
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
            label={t('common:name')}
            controlProps={{
              name: 'name',
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
