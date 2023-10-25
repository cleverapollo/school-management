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
import {
  ReturnTypeFromUseNoteTagsBehaviour,
  useUpsertBehaviourTags,
  useBehaviourCategory,
} from '@tyro/people';
import { useEffect, useMemo } from 'react';
import { Notes_BehaviourType } from '@tyro/api';

export interface UpsertBehaviourLabelModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNoteTagsBehaviour> | null;
}

export type UpsertBehaviourLabelFormState = {
  name: string;
  description: string;
  behaviourType: Notes_BehaviourType;
  categoryId: number;
};

export const UpsertBehaviourLabelModal = ({
  initialState,
  onClose,
}: UpsertBehaviourLabelModalProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const currentLanguageCode = i18n.language;

  const { data: categories } = useBehaviourCategory({});
  const { mutate, isLoading } = useUpsertBehaviourTags();

  const { resolver, rules } = useFormValidator<UpsertBehaviourLabelFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<UpsertBehaviourLabelFormState>({
      resolver: resolver({
        name: rules.required(),
        behaviourType: rules.required(),
      }),
    });

  const behaviourType = watch('behaviourType');
  const filteredCategories = useMemo(
    () =>
      categories?.filter(
        (category) => category.behaviourType === behaviourType
      ),
    [categories, behaviourType]
  );

  const onSubmit = handleSubmit((data) => {
    mutate(
      [
        {
          id: initialState?.id,
          tag_l2: initialState?.tag_l2 || data.name.replace(/\s/g, '_'),
          name: [{ locale: currentLanguageCode, value: data.name }],
          description: [
            { locale: currentLanguageCode, value: data.description },
          ],
          behaviourType: data.behaviourType,
          categoryId: data.categoryId,
        },
      ],
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  });

  useEffect(() => {
    reset({
      name: initialState?.name,
      description: initialState?.description || '',
      behaviourType: initialState?.behaviourType || Notes_BehaviourType.Neutral,
      categoryId: initialState?.behaviourCategory?.behaviourCategoryId,
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
        {initialState?.id
          ? t('settings:behaviourLabel.editBehaviourLabel')
          : t('settings:behaviourLabel.createBehaviourLabel')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} mt={1}>
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
            <RHFSelect
              fullWidth
              options={filteredCategories || []}
              label={t('common:category')}
              getOptionLabel={(option) => option.name}
              optionIdKey="behaviourCategoryId"
              controlProps={{
                name: 'categoryId',
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
