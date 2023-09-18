import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { getColorBasedOnIndex } from '@tyro/api';
import {
  RHFAutocomplete,
  RHFDateTimePicker,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import type { Dayjs } from 'dayjs';
import { useNoteTagsBehaviour } from '../../api/behaviour/behaviour-tags';
import { ReturnTypeFromUseBehaviours } from '../../api/behaviour/list';
import { useUpsertStudentBehaviour } from '../../api/behaviour/upsert-behaviour';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../api/student/overview';

export interface CreateBehaviourModalProps {
  studentId: number;
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseBehaviours> | null;
}

export type CreateBehaviourFormState = {
  behaviour: number;
  note: string;
  subjects: ReturnTypeFromUseStudentSubjectGroups[];
  occurredOn: Dayjs;
};

export function CreateBehaviourModal({
  studentId,
  onClose,
  initialState,
}: CreateBehaviourModalProps) {
  const { t } = useTranslation(['common', 'people']);
  const { data: subjectGroup = [] } = useStudentsSubjectGroups(studentId);
  const { data: behaviourTags = [] } = useNoteTagsBehaviour();

  const { resolver, rules } = useFormValidator<CreateBehaviourFormState>();
  const { control, handleSubmit, reset } = useForm<CreateBehaviourFormState>({
    resolver: resolver({
      occurredOn: rules.required(),
      behaviour: rules.required(),
      note: rules.required(),
    }),
  });

  const { mutate, isLoading } = useUpsertStudentBehaviour(studentId);

  const onSubmit = ({
    subjects,
    occurredOn,
    behaviour,
    note,
  }: CreateBehaviourFormState) => {
    mutate(
      [
        {
          note,
          referencedParties: [studentId],
          tags: [behaviour],
          associatedParties: subjects.map((subject) => subject.partyId),
          incidentDate: occurredOn.format('YYYY-MM-DDTHH:mm:ss'),
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
        <DialogContent>
          <Stack gap={3} mt={1}>
            <RHFDateTimePicker
              label={t('common:date')}
              controlProps={{
                name: 'occurredOn',
                control,
              }}
            />
            <RHFAutocomplete
              multiple
              label={t('common:subjects')}
              optionIdKey="partyId"
              getOptionLabel={(option) => option.subjects[0]?.name}
              controlProps={{ name: 'subjects', control }}
              options={subjectGroup}
              renderTags={(tags, getTagProps) =>
                tags.map((tag, index) => {
                  const [subject] = tag.subjects || [];

                  return (
                    <Chip
                      {...getTagProps({ index })}
                      size="small"
                      variant="soft"
                      color={
                        subject?.colour || getColorBasedOnIndex(tag.partyId)
                      }
                      label={subject?.name}
                    />
                  );
                })
              }
            />
            <RHFSelect
              fullWidth
              optionIdKey="id"
              getOptionLabel={(option) => option.name}
              options={behaviourTags}
              label={t('common:category')}
              renderValue={(value) => (
                <Chip
                  size="small"
                  variant="soft"
                  color={getColorBasedOnIndex(value.id)}
                  label={value.name}
                />
              )}
              controlProps={{
                name: 'behaviour',
                control,
              }}
            />
            <RHFTextField
              label={t('common:details')}
              controlProps={{
                name: 'note',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                rows: 4,
              }}
            />
          </Stack>
        </DialogContent>

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
