import { Button, DialogContent, Stack } from '@mui/material';
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
import { useEffect } from 'react';
import {
  useUpsertBehaviourCategory,
  ReturnTypeFromUseBehaviourCategory,
} from '@tyro/people';

export interface UpsertCategoryModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseBehaviourCategory> | null;
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

  const { control, handleSubmit, reset } = useForm<UpsertCategoryFormState>({
    resolver: resolver({
      behaviourType: rules.required(),
      name: rules.required(),
    }),
  });

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
          onClose();
        },
      }
    );
  });

  useEffect(() => {
    reset({
      behaviourType: Notes_BehaviourType.Neutral,
      name: initialState?.name,
      description: initialState?.description || '',
    });
  }, [initialState]);

  return (
    <Dialog
      open={!!initialState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialState?.behaviourCategoryId
          ? t('settings:category.editCategory')
          : t('settings:category.createCategory')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} mt={1}>
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
        </DialogContent>

        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
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
