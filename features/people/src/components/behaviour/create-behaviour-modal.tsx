import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { getColorBasedOnIndex, Notes_BehaviourType, Person } from '@tyro/api';
import {
  RHFAutocomplete,
  RHFDateTimePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { SetStateAction, Dispatch, useMemo, useEffect } from 'react';
import { useNoteTagsBehaviour } from '../../api/behaviour/behaviour-tags';
import { ReturnTypeFromUseStudentBehaviour } from '../../api/behaviour/student-behaviour';
import { useUpsertStudentBehaviour } from '../../api/behaviour/upsert-behaviour';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../api/student/overview';
import { RHFStudentAutocomplete } from '../common/student-autocomplete';
import { StudentsSelectOption } from '../../api/student/students';

export type CreateBehaviourFormState =
  NonNullable<ReturnTypeFromUseStudentBehaviour> & {
    students: StudentsSelectOption;
    noteId: number | null;
    behaviour: number;
    note: string;
    subjects: Pick<
      ReturnTypeFromUseStudentSubjectGroups,
      'name' | 'partyId' | 'subjects'
    >[];
    occurredOn: Dayjs;
    behaviourTypeState: Notes_BehaviourType;
  };
export type CreateBehaviourModalProps = {
  noteId?: number;
  open: boolean;
  onClose: () => void;
  initialState: Partial<CreateBehaviourFormState> | null;
  behaviourType?: Notes_BehaviourType;
  setBehaviourType?: Dispatch<SetStateAction<Notes_BehaviourType>>;
};

export function CreateBehaviourModal({
  open,
  onClose,
  initialState,
  behaviourType = Notes_BehaviourType.Positive,
  setBehaviourType,
}: CreateBehaviourModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { resolver, rules } = useFormValidator<CreateBehaviourFormState>();

  const { control, handleSubmit, reset, watch } =
    useForm<CreateBehaviourFormState>({
      resolver: resolver({
        students: rules.required(),
        occurredOn: rules.required(),
        behaviour: rules.required(),
      }),
      defaultValues: {
        occurredOn: dayjs(),
        behaviourTypeState: behaviourType,
      },
    });

  const [behaviourTypeOption, students] = watch([
    'behaviourTypeState',
    'students',
  ]);
  const studentIds = students?.map(({ partyId }) => partyId) ?? [];

  const { data: subjectGroups = [] } = useStudentsSubjectGroups(studentIds, {
    enabled: open,
  });
  const { data: behaviourTags = [], isLoading: isLoadingBehaviourTags } =
    useNoteTagsBehaviour();

  const { mutate, isLoading } = useUpsertStudentBehaviour();

  const onSubmit = ({
    subjects,
    occurredOn,
    behaviour,
    note,
    behaviourTypeState,
  }: CreateBehaviourFormState) => {
    const subjectIds = subjects?.map((subject) => subject?.partyId);

    mutate(
      [
        {
          id: initialState?.noteId,
          note: note ?? initialState?.details,
          referencedParties: studentIds,
          tags: [behaviour],
          associatedParties: subjectIds ?? [initialState?.associatedPartyIds],
          incidentDate: occurredOn.format('YYYY-MM-DDTHH:mm:ss'),
        },
      ],
      {
        onSuccess: () => {
          if (setBehaviourType) {
            setBehaviourType(behaviourTypeState);
          }
          onClose();
          reset();
        },
      }
    );
  };

  const filterTagsByBehaviourType = useMemo(
    () =>
      behaviourTags?.filter((tag) => tag.behaviourType === behaviourTypeOption),
    [behaviourTypeOption, behaviourTags]
  );

  useEffect(() => {
    let initStudents = initialState?.students;

    if (!initStudents) {
      initStudents = initialState?.referencedParties ?? [];
    }

    reset({
      ...(initialState ?? {}),
      students: initStudents as Person[],
      subjects: (initialState?.associatedParties ??
        initialState?.subjects) as ReturnTypeFromUseStudentSubjectGroups[],
      behaviour: (initialState?.tagIds && initialState?.tagIds[0]) ?? undefined,
      note: initialState?.details,
      behaviourTypeState:
        initialState?.tags?.[0]?.behaviourType ?? behaviourType,
      occurredOn: dayjs(initialState?.incidentDate || undefined),
    });
  }, [initialState, behaviourType]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {isLoadingBehaviourTags ? (
          <Stack minHeight="40vh" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <DialogTitle onClose={onClose}>
              {initialState?.noteId
                ? t('people:editBehaviour')
                : t('people:createBehaviour')}
            </DialogTitle>
            <DialogContent>
              <Stack gap={3} mt={1}>
                <RHFStudentAutocomplete
                  multiple
                  label={t('common:students')}
                  controlProps={{
                    name: 'students',
                    control,
                  }}
                  limitTags={3}
                />
                <RHFDateTimePicker
                  label={t('common:date')}
                  controlProps={{
                    name: 'occurredOn',
                    control,
                  }}
                />
                <RHFAutocomplete
                  multiple
                  label={t('people:associations')}
                  optionIdKey="partyId"
                  getOptionLabel={(option) =>
                    `${option.subjects[0]?.name} - ${option.name}`
                  }
                  controlProps={{ name: 'subjects', control }}
                  options={subjectGroups}
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
                          label={`${subject?.name} - ${tag.name}`}
                        />
                      );
                    })
                  }
                />
                <RHFRadioGroup
                  radioGroupProps={{ sx: { flexDirection: 'row' } }}
                  label={t('people:behaviourType')}
                  options={[
                    Notes_BehaviourType.Positive,
                    Notes_BehaviourType.Negative,
                    Notes_BehaviourType.Neutral,
                  ].map((option) => ({
                    value: option,
                    label: t(`people:behaviourTypes.${option}`),
                  }))}
                  controlProps={{
                    name: 'behaviourTypeState',
                    defaultValue: behaviourType,
                    control,
                  }}
                />
                <RHFSelect
                  fullWidth
                  optionIdKey="id"
                  getOptionLabel={(option) => option.name}
                  options={filterTagsByBehaviourType}
                  label={t('people:tags')}
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

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
              >
                {t('common:actions.save')}
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </form>
    </Dialog>
  );
}
