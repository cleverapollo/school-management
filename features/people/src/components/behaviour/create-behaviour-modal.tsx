import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { getColorBasedOnIndex, Notes_BehaviourType } from '@tyro/api';
import {
  RHFAutocomplete,
  RHFDateTimePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import type { Dayjs } from 'dayjs';
import { SetStateAction, Dispatch, useMemo } from 'react';
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
  behaviourType: Notes_BehaviourType;
  setBehaviourType: Dispatch<SetStateAction<Notes_BehaviourType>>;
}

export type CreateBehaviourFormState = {
  behaviour: number;
  note: string;
  subjects: ReturnTypeFromUseStudentSubjectGroups[];
  occurredOn: Dayjs;
  behaviourTypeState: Notes_BehaviourType;
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
  const { control, handleSubmit, reset, watch } =
    useForm<CreateBehaviourFormState>({
      resolver: resolver({
        occurredOn: rules.required(),
        behaviour: rules.required(),
      }),
    });

  const { mutate, isLoading } = useUpsertStudentBehaviour(studentId);

  const onSubmit = ({
    subjects,
    occurredOn,
    behaviour,
    note,
    behaviourTypeState,
  }: CreateBehaviourFormState) => {
    setBehaviourType(behaviourTypeState);
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

  const behaviourTypeOption = watch('behaviourTypeState');
  const behaviourTypeToCheck = behaviourTypeOption || behaviourType;

  const filterTagsByBehaviourType = useMemo(
    () =>
      behaviourTags?.filter(
        (tag) => tag.behaviourType === behaviourTypeToCheck
      ),
    [behaviourTypeToCheck, behaviourTypeOption, behaviourType]
  );

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
            <DialogTitle>{t('people:createBehaviour')}</DialogTitle>
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
