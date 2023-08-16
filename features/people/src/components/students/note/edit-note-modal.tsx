import {
  Button,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
import { getNumber, RHFAutocomplete, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Notes_Tag, Notes_UpsertNote } from '@tyro/api';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people']);
  const studentId = getNumber(id);
  const { mutate: createOrUpdateNoteMutation, isLoading: isSubmitting } =
    useUpsertNote(studentId);
  const { data: noteTags = [] } = useNoteTags();

  const initialFormState = {
    note: initialNoteState?.note,
    tags: initialNoteState?.tags ?? [],
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialFormState,
  });

  const onSubmit = ({
    note,
    tags,
    ...restData
  }: Partial<EditNoteFormState>) => {
    if (!studentId) {
      return;
    }

    createOrUpdateNoteMutation(
      [
        {
          note,
          id: initialNoteState?.id,
          tags: (tags ?? []).map(({ id }) => id ?? 0),
          referencedParties: [studentId],
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
      reset(initialFormState);
    }
  }, [initialNoteState]);

  const handleClose = () => {
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
                autoFocus: true,
              }}
            />
            <RHFAutocomplete
              multiple
              label={t('people:noteType')}
              optionIdKey="id"
              optionTextKey="name"
              controlProps={{ name: 'tags', control }}
              options={noteTags as { id: number; name: string }[]}
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
