import { Button, Stack } from '@mui/material';
import {
  RHFSelect,
  RHFTextField,
  useFormValidator,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@tyro/core';
import { SaveCommentInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useCreateCommentBank } from '../../api/comment-banks/save-comment-bank';
import { ReturnTypeFromCommentBanks } from '../../api/comment-banks/comment-banks';

export type AddCommentFormState = Pick<SaveCommentInput, 'comment'> & {
  active: string;
};

export type AddCommentProps = {
  initialModalState: Partial<AddCommentFormState> | null;
  onClose: () => void;
  commentBanks: ReturnTypeFromCommentBanks[];
};

export const AddComment = ({
  initialModalState,
  onClose,
  commentBanks,
}: AddCommentProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { mutate: createCommentBank, isLoading } = useCreateCommentBank();

  const { resolver, rules } = useFormValidator<AddCommentFormState>();

  const defaultFormStateValues: Partial<AddCommentFormState> = {
    ...initialModalState,
  };

  const { control, handleSubmit, reset } = useForm<AddCommentFormState>({
    resolver: resolver({
      comment: [rules.required()],
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(({ comment, active, ...restData }) => {
    if (commentBanks && comment) {
      const oldComments = commentBanks[0]?.comments;
      const newComment = {
        comment,
        active: active === 'Active',
      };
      const updatedComments = [...(oldComments || []), newComment];
      // console.log(updatedComments, 'updatedComments');
      // ** ADD THIS WHEN BE SUPPORTS IT **
      // createCommentBank({
      //   id: commentBanks[0]?.id,
      //   name: commentBanks[0]?.name,
      //   description: commentBanks[0]?.description,
      //   active: commentBanks[0]?.active,
      //   comments: updatedComments,
      // });
    }
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialModalState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('settings:commentBanks.createComment')}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <RHFTextField<AddCommentFormState>
              label={t('settings:commentBanks.comment')}
              textFieldProps={{ fullWidth: true }}
              controlProps={{
                name: 'comment',
                control,
              }}
            />
            <RHFSelect<AddCommentFormState, string>
              fullWidth
              options={[
                t('settings:active'),
                t('settings:commentBanks.archived'),
              ]}
              label={t('settings:commentBanks.status')}
              getOptionLabel={(option) => option}
              controlProps={{
                name: 'active',
                control,
                defaultValue: t('settings:active'),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={false}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
