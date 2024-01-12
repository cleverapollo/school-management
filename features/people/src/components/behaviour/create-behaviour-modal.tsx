import { LoadingButton } from '@mui/lab';
import { Button, Chip, CircularProgress, Stack } from '@mui/material';
import { getColorBasedOnIndex, Notes_BehaviourType } from '@tyro/api';
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
import { ReturnTypeFromUseIndividualStudentBehaviour } from '../../api/behaviour/individual-student-behaviour';
import { useUpsertStudentBehaviour } from '../../api/behaviour/upsert-behaviour';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../api/student/overview';

export type CreateBehaviourFormState =
  NonNullable<ReturnTypeFromUseIndividualStudentBehaviour> & {
    noteId: number | null;
    behaviour: number;
    note: string;
    subjects: ReturnTypeFromUseStudentSubjectGroups[];
    occurredOn: Dayjs;
    behaviourTypeState: Notes_BehaviourType;
  };
export type CreateBehaviourModalProps = {
  noteId?: number;
  studentId: number;
  onClose: () => void;
  initialState: Partial<CreateBehaviourFormState> | null;
  behaviourType: Notes_BehaviourType;
  setBehaviourType: Dispatch<SetStateAction<Notes_BehaviourType>>;
};

export function CreateBehaviourModal({
  studentId,
  onClose,
  initialState,
  behaviourType,
  setBehaviourType,
}: CreateBehaviourModalProps) {
  const { t } = useTranslation(['common', 'people']);
  const { data: subjectGroup = [] } = useStudentsSubjectGroups(studentId);
  const { data: behaviourTags = [], isLoading: isLoadingBehaviourTags } =
    useNoteTagsBehaviour();

  const { resolver, rules } = useFormValidator<CreateBehaviourFormState>();

  const defaultFormStateValues: Partial<CreateBehaviourFormState> = {
    subjects:
      initialState?.associatedParties as ReturnTypeFromUseStudentSubjectGroups[],
    behaviour: (initialState?.tagIds && initialState?.tagIds[0]) ?? 0,
    note: initialState?.details,
    behaviourTypeState: behaviourType,
    occurredOn: dayjs(initialState?.incidentDate || undefined),
  };

  const { control, handleSubmit, reset, watch } =
    useForm<CreateBehaviourFormState>({
      resolver: resolver({
        occurredOn: rules.required(),
        behaviour: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
    });

  const { mutate, isLoading } = useUpsertStudentBehaviour(studentId);

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
          referencedParties: [studentId],
          tags: [behaviour],
          associatedParties: subjectIds ?? [initialState?.associatedPartyIds],
          incidentDate: occurredOn.format('YYYY-MM-DDTHH:mm:ss'),
        },
      ],
      {
        onSuccess: () => {
          setBehaviourType(behaviourTypeState);
          onClose();
          reset();
        },
      }
    );
  };

  const behaviourTypeOption = watch('behaviourTypeState');

  const filterTagsByBehaviourType = useMemo(
    () =>
      behaviourTags?.filter((tag) => tag.behaviourType === behaviourTypeOption),
    [behaviourTypeOption, behaviourTags]
  );

  useEffect(() => {
    reset({
      ...defaultFormStateValues,
      ...(initialState ?? {}),
    });
  }, [initialState]);

  return (
    <Dialog
      open={!!initialState}
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
