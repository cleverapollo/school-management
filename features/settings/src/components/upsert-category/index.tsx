import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

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
  name: string;
  description: string;
};

export const UpsertCategoryModal = ({
  initialState,
  onClose,
}: UpsertCategoryModalProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { resolver, rules } = useFormValidator<UpsertCategoryFormState>();

  const defaultFormStateValues: Partial<UpsertCategoryFormState> = {
    name: initialState?.name,
    description: initialState?.description || '',
  };

  const { control, handleSubmit, reset } = useForm<UpsertCategoryFormState>({
    resolver: resolver({
      name: rules.required(),
    }),
    defaultValues: defaultFormStateValues,
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit((data) => {
    // TODO: update this action when API integrate API
    console.log('Submit category', data);
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
          : t('settings:category.createCategory')
        }
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

          <LoadingButton type="submit" variant="contained" loading={false}>
            {initialState?.id
              ? t('common:actions.edit')
              : t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}