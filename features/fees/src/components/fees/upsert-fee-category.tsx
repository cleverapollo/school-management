import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import {
  RHFTextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useFormValidator,
  RHFCheckbox,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSaveFeeCategory } from '../../api/save-fee-category';

type FeeCategoryFormState = {
  name: string;
  description?: string | null;
  active?: boolean;
};

export type UpsertFeeCategoryModalProps = {
  open: boolean;
  value: Partial<FeeCategoryFormState> | null;
  onClose: () => void;
};

export function UpsertFeeCategoryModal({
  open,
  value,
  onClose,
}: UpsertFeeCategoryModalProps) {
  const { t } = useTranslation(['common', 'fees']);
  const { mutateAsync: saveFeeCategory, isLoading } = useSaveFeeCategory();

  const { resolver, rules } = useFormValidator<FeeCategoryFormState>();
  const { control, reset, handleSubmit } = useForm<FeeCategoryFormState>({
    resolver: resolver({
      name: rules.required(),
    }),
  });

  const onSubmit = handleSubmit((data) =>
    saveFeeCategory(data, {
      onSuccess: onClose,
    })
  );

  useEffect(() => {
    const { active } = value || {};
    reset({ ...value, active: active ?? true });
  }, [value]);

  return (
    <Dialog
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="xs"
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {t(`fees:${value?.name ? 'editFeeCategory' : 'createFeeCategory'}`)}
        </DialogTitle>
        <DialogContent>
          <Stack gap={3} mt={1}>
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
                fullWidth: true,
                multiline: true,
                rows: 3,
              }}
            />

            <RHFCheckbox
              label={t('common:active')}
              checkboxProps={{ color: 'primary' }}
              controlProps={{
                name: 'active',
                control,
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
