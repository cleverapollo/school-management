import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Notes_BehaviourType, getColorBasedOnIndex } from '@tyro/api';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { ReturnTypeFromUseBehaviours } from '../../api/behaviour/list';
import { useUpsertBehaviourTags } from '../../api/behaviour/upsert-behaviour-tags';
import { useUpsertNote } from '../../api/note/upsert-note';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../api/student/overview';
import { useNoteTagsBehaviour } from '../../api/behaviour/behaviour-tags';

type BehaviourFormState = NonNullable<ReturnTypeFromUseBehaviours>;

export interface CreateBehaviourModalProps {
  studentId: number;
  onClose: () => void;
  initialState: Partial<BehaviourFormState> | null;
}

export type CreateBehaviourFormState = {
  behaviour: string;
  category: Notes_BehaviourType;
  details: string;
  subjects: ReturnTypeFromUseStudentSubjectGroups[];
  outcome: string;
  occurredOn: Date;
};

export function CreateBehaviourModal({
  studentId,
  onClose,
  initialState,
}: CreateBehaviourModalProps) {
  const { t } = useTranslation(['common', 'people']);
  const { data: subjectGroup } = useStudentsSubjectGroups(studentId);
  const { data: behaviourTags } = useNoteTagsBehaviour();
  const { resolver, rules } = useFormValidator<CreateBehaviourFormState>();
  const { control, handleSubmit, reset } = useForm<CreateBehaviourFormState>({
    resolver: resolver({
      behaviour: rules.required(),
      category: rules.required(),
      occurredOn: rules.required(),
    }),
    mode: 'onChange',
  });

  const { mutateAsync: createBehaviour } = useUpsertNote(studentId);
  const { mutateAsync: createBehaviourTags } =
    useUpsertBehaviourTags(studentId);

  const onSubmit = async (data: CreateBehaviourFormState) => {
    // const tags = await createBehaviourTags(
    //   data.subjects.map((item) => ({
    //     behaviourType: data.category,
    //     tag_l2: item.subjects[0]?.name,
    //   }))
    // );
    // await createBehaviour([
    //   {
    //     note: data.behaviour,
    //     referencedParties: [studentId],
    //     // tags: tags.notes_upsertBehaviourTags.map((tag) => tag.id),
    //   },
    // ]);
    // onClose();
    // reset();
  };

  return (
    <Dialog
      open={!!initialState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('people:createBehaviour')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Stack direction="row" gap={2} gridColumn={2}>
            <RHFTextField<CreateBehaviourFormState>
              label={t('people:behaviour')}
              controlProps={{
                name: 'behaviour',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFSelect<CreateBehaviourFormState, Notes_BehaviourType>
              fullWidth
              options={Object.values(Notes_BehaviourType)}
              label={t('people:category')}
              getOptionLabel={(option) => t(`people:categoryValues.${option}`)}
              controlProps={{
                name: 'category',
                control,
              }}
            />
          </Stack>
          <Stack direction="column" gap={2}>
            <RHFTextField<CreateBehaviourFormState>
              label={t('common:details')}
              controlProps={{
                name: 'details',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFAutocomplete
              multiple
              label={t('people:associated')}
              optionIdKey="partyId"
              getOptionLabel={(option) => option.subjects[0]?.name}
              controlProps={{ name: 'subjects', control }}
              options={subjectGroup ?? []}
              sx={{ mt: 2 }}
              renderTags={(tags, getTagProps) =>
                tags.map((tag, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    size="small"
                    variant="soft"
                    color={
                      tag.subjects[0]?.colour || getColorBasedOnIndex(index)
                    }
                    label={tag.subjects[0]?.name}
                  />
                ))
              }
            />
            <RHFTextField<CreateBehaviourFormState>
              label={t('people:outcome')}
              controlProps={{
                name: 'outcome',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFDatePicker<CreateBehaviourFormState>
              label={t('people:occurredOn')}
              controlProps={{
                name: 'occurredOn',
                control,
              }}
            />
          </Stack>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained">
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
