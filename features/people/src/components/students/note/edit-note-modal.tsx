import {
  Button,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
import { RHFAutocomplete, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Notes_Tag, Notes_UpsertNote } from '@tyro/api';
import React, { useEffect } from 'react';
import { useUpsertNote } from '../../../api/note/upsert-note';
import { useNoteTags } from '../../../api/note/note-tags';

export type EditNoteFormState = Pick<
  Notes_UpsertNote,
  'createdBy' | 'createdOn' | 'id' | 'referencedParties'
> & {
  note?: string | null;
  tags: Partial<Notes_Tag>[];
};

export type EditNoteModalProps = {
  initialNoteState?: Partial<EditNoteFormState> | undefined;
  onClose: () => void;
};

export const EditNoteModal = ({
  initialNoteState,
  onClose,
}: EditNoteModalProps) => {
  const { t } = useTranslation(['common', 'people']);
  const {
    mutate: createOrUpdateNoteMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useUpsertNote();
  const { data: noteTags = [] } = useNoteTags();

  const { resolver, rules } = useFormValidator<Partial<EditNoteFormState>>();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...initialNoteState,
      tags: (initialNoteState?.tags ?? []).map(({ id, name }) => ({
        id,
        name,
      })),
    },
  });

  const onSubmit = ({
    note,
    tags,
    ...restData
  }: Partial<EditNoteFormState>) => {
    createOrUpdateNoteMutation(
      [
        {
          note,
          tags: (tags ?? []).map(({ id }) => id ?? 0),
          ...restData,
        },
      ],
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialNoteState) {
      reset(initialNoteState);
    }
  }, [initialNoteState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={!!initialNoteState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialNoteState?.id ? t('people:editNote') : t('people:addNote')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack py={1}>
            <RHFTextField
              label={t('people:note')}
              controlProps={{
                name: 'note',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                minRows: 3,
              }}
            />
            <RHFAutocomplete
              multiple
              label={t('people:noteType')}
              optionIdKey="id"
              optionTextKey="name"
              controlProps={{ name: 'tags', control }}
              options={(noteTags ?? [])
                .filter((tag) => tag !== null)
                .map((tag) => ({ id: tag?.id, name: tag?.name }))}
              sx={{ mt: 2 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
