import { Button, Stack } from '@mui/material';
import {
  RHFTextField,
  useFormValidator,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@tyro/core';
import { SaveCommentBankInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { useCreateCommentBank } from '../../api/comment-banks/save-comment-bank';

export type AddCommentBankFormState = Pick<
  SaveCommentBankInput,
  'id' | 'name' | 'description' | 'active' | 'comments'
>;

export type AddCommentBankProps = {
  initialModalState: Partial<AddCommentBankFormState> | null;
  onClose: () => void;
};

export const AddCommentBank = ({
  initialModalState,
  onClose,
}: AddCommentBankProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { mutate: createCommentBank, isLoading } = useCreateCommentBank();

  const { resolver, rules } = useFormValidator<AddCommentBankFormState>();

  const defaultFormStateValues: Partial<AddCommentBankFormState> = {
    ...initialModalState,
  };

  const { control, handleSubmit, reset } = useForm<AddCommentBankFormState>({
    resolver: resolver({
      name: [rules.required()],
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(({ name, description }) => {
    createCommentBank(
      [
        {
          name,
          description,
          comments: [],
        },
      ],
      { onSuccess: onClose }
    );
  });

  useEffect(() => {
    reset({
      ...defaultFormStateValues,
      ...(initialModalState ?? {}),
    });
  }, [initialModalState]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={!!initialModalState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('settings:commentBanks.createCommentBank')}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <RHFTextField
              label={t('common:name')}
              textFieldProps={{ fullWidth: true }}
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
                fullWidth: true,
              }}
            />
          </Stack>
        </DialogContent>

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
