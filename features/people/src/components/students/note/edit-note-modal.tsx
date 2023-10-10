import { Button, Stack, Chip, Collapse } from '@mui/material';
import {
  RHFAutocomplete,
  RHFTextField,
  useFormValidator,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  RHFSwitch,
  RHFDateRangePicker,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { getColorBasedOnIndex, usePermissions } from '@tyro/api';
import dayjs, { Dayjs } from 'dayjs';
import { useUpsertNote } from '../../../api/note/upsert-note';
import { useNoteTags } from '../../../api/note/note-tags';
import { ReturnTypeFromUseNotes } from '../../../api/note/list';

type NoteFormState = NonNullable<ReturnTypeFromUseNotes> & {
  priorityDateRange?: [Dayjs, Dayjs];
};

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
  const { hasPermission } = usePermissions();
  const { mutate: createOrUpdateNoteMutation, isLoading: isSubmitting } =
    useUpsertNote();
  const { data: noteTags = [] } = useNoteTags();

  const { resolver, rules } = useFormValidator<NoteFormState>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NoteFormState>({
    defaultValues: {
      ...initialState,
      priorityDateRange:
        initialState?.priorityStartDate && initialState?.priorityEndDate
          ? [
              dayjs(initialState?.priorityStartDate),
              dayjs(initialState?.priorityEndDate),
            ]
          : undefined,
    },
    resolver: resolver({
      note: rules.required(),
      tags: rules.required(),
      priorityDateRange: rules.required(),
    }),
  });

  const onSubmit = handleSubmit(
    ({ note, tags, priorityDateRange, ...restData }) => {
      const [startDate, endDate] = priorityDateRange || [null, null];

      createOrUpdateNoteMutation(
        [
          {
            ...restData,
            id: initialState?.id,
            note,
            tags: tags.map(({ id }) => id),
            referencedParties: [studentId],
            priorityStartDate: startDate
              ? startDate.format('YYYY-MM-DD')
              : null,
            priorityEndDate: endDate ? endDate.format('YYYY-MM-DD') : null,
          },
        ],
        {
          onSuccess: onClose,
        }
      );
    }
  );

  const priorityNote = watch('priorityNote');

  return (
    <Dialog
      open={!!initialState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialState?.id ? t('people:editNote') : t('people:addNote')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack pt={1} spacing={3}>
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

            {hasPermission('ps:1:wellbeing:write_priority_students') && (
              <>
                <RHFSwitch
                  label={t('people:markAsPriorityNote')}
                  controlProps={{ name: 'priorityNote', control }}
                  controlLabelProps={{ sx: { mt: 2 } }}
                />

                <Collapse
                  in={!!priorityNote}
                  unmountOnExit
                  sx={{
                    '&.MuiCollapse-root': {
                      marginTop: 1,
                    },
                  }}
                >
                  <RHFDateRangePicker
                    label={t('people:priorityDateRange')}
                    controlProps={{ name: 'priorityDateRange', control }}
                    textFieldProps={{
                      fullWidth: true,
                    }}
                  />
                </Collapse>
              </>
            )}
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
