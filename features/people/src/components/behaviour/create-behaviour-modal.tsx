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
  RHFDateTimePicker,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import {
  ReturnTypeFromUseNoteTagsBehaviour,
  useNoteTagsBehaviour,
} from '../../api/behaviour/behaviour-tags';
import { ReturnTypeFromUseBehaviours } from '../../api/behaviour/list';
import { useUpsertBehaviours } from '../../api/behaviour/upsert-behaviour';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../api/student/overview';

type BehaviourFormState = NonNullable<ReturnTypeFromUseBehaviours>;

export interface CreateBehaviourModalProps {
  studentId: number;
  onClose: () => void;
  initialState: Partial<BehaviourFormState> | null;
}

export type CreateBehaviourFormState = {
  behaviour: number;
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

  const { mutate, isLoading } = useUpsertBehaviours(studentId);

  const onSubmit = (data: CreateBehaviourFormState) => {
    mutate(
      [
        {
          note: data.details,
          referencedParties: [studentId],
          tags: [data.behaviour],
          associatedParties: data.subjects.map((subject) => subject.partyId),
          createdOn: data.occurredOn.toISOString(),
        },
      ],
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
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
            <RHFSelect<
              CreateBehaviourFormState,
              ReturnTypeFromUseNoteTagsBehaviour
            >
              fullWidth
              optionIdKey="id"
              options={behaviourTags ?? []}
              label={t('people:category')}
              getOptionLabel={(option) => option.name}
              controlProps={{
                name: 'behaviour',
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
            <RHFDateTimePicker<CreateBehaviourFormState>
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

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
