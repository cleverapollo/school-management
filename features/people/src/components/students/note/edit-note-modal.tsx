import {
  Button,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Stack,
  Chip,
} from '@mui/material';
import { RHFAutocomplete, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { getColorBasedOnIndex } from '@tyro/api';
import { useUpsertNote } from '../../../api/note/upsert-note';
import { useNoteTags } from '../../../api/note/note-tags';
import { ReturnTypeFromUseNotes } from '../../../api/note/list';

type NoteFormState = NonNullable<ReturnTypeFromUseNotes>;

export type EditNoteModalProps = {
  initialState: Partial<NoteFormState> | null;
  onClose: () => void;
  studentId: number;
};

export const EditNoteModal = ({
  initialState,
  onClose,
  studentId,
}: EditNoteModalProps) => {
  const { t } = useTranslation(['common', 'people']);
  const { mutate: createOrUpdateNoteMutation, isLoading: isSubmitting } =
    useUpsertNote(studentId);
  const { data: noteTags = [] } = useNoteTags();

  const { resolver, rules } = useFormValidator<NoteFormState>();

  const { control, handleSubmit } = useForm<NoteFormState>({
    defaultValues: { ...initialState },
    resolver: resolver({
      note: rules.required(),
      tags: rules.required(),
    }),
  });

  const onSubmit = handleSubmit(({ note, tags, ...restData }) => {
    createOrUpdateNoteMutation(
      [
        {
          ...restData,
          id: initialState?.id,
          note,
          tags: tags.map(({ id }) => id),
          referencedParties: [studentId],
        },
      ],
      {
        onSuccess: onClose,
      }
    );
  });

  return (
    <Dialog
      open={!!initialState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialState?.id ? t('people:editNote') : t('people:addNote')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
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
              label={t('common:label')}
              optionIdKey="id"
              optionTextKey="name"
              controlProps={{ name: 'tags', control }}
              options={noteTags}
              sx={{ mt: 2 }}
              renderTags={(tags, getTagProps) =>
                tags.map((tag, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    size="small"
                    variant="soft"
                    color={getColorBasedOnIndex(tag.id)}
                    label={tag.name}
                  />
                ))
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
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
