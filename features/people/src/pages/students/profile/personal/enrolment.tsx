import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ReturnTypeDisplayNames,
  RHFTextField,
  usePreferredNameLayout,
  CardEditableForm,
  CardEditableFormProps,
  RHFDatePicker,
  RHFCheckbox,
  RHFSelect,
  useFormValidator,
} from '@tyro/core';
import { StudentLeavingReason, UpdateStudentInput } from '@tyro/api';
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useStudentPersonal } from '../../../../api/student/personal';

type EnrolmentFormState = {
  lockerNumber: UpdateStudentInput['lockerNumber'];
  examNumber: UpdateStudentInput['examNumber'];
  leftEarly: UpdateStudentInput['leftEarly'];
  dateOfLeaving: UpdateStudentInput['dateOfLeaving'];
  leavingReason: UpdateStudentInput['leavingReason'];
};

const getEnrolmentDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  displayNames: ReturnTypeDisplayNames,
  t: TFunction<('people' | 'common')[]>,
  leftEarlyState: boolean,
  onChangeLeftEarlyState: Dispatch<SetStateAction<boolean>>
): CardEditableFormProps<EnrolmentFormState>['fields'] => {
  const {
    leftEarly,
    studentIrePP,
    startDate,
    endDate,
    classGroup,
    tutors,
    yearGroupLeads,
    yearGroups,
    programmeStages,
  } = data || {};

  const [programmeStage] = programmeStages || [];
  const { programme } = programmeStage || {};
  const [yearGroup] = yearGroups || [];

  return [
    {
      label: t('people:personal.enrolmentHistory.enrolmentDate'),
      value: startDate ? dayjs(startDate) : null,
      valueRenderer: startDate ? dayjs(startDate).format('l') : '-',
    },
    {
      label: t('people:personal.programme'),
      value: programme?.name,
    },
    {
      label: t('people:personal.enrolmentHistory.programmeYear'),
      value: yearGroup?.name,
    },
    {
      label: t('people:personal.enrolmentHistory.classGroup'),
      value: classGroup?.name,
    },
    {
      label: t('people:personal.enrolmentHistory.classTutor'),
      value: displayNames(tutors),
    },
    {
      label: t('people:personal.enrolmentHistory.yearHead'),
      value: displayNames(yearGroupLeads),
    },
    {
      label: t('people:personal.enrolmentHistory.lockerNumber'),
      value: studentIrePP?.lockerNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'lockerNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.enrolmentHistory.examNumber'),
      value: studentIrePP?.examNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'examNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.enrolmentHistory.previousSchoolType'),
      value: studentIrePP?.previousSchoolType,
    },
    {
      label: t('people:personal.enrolmentHistory.previousSchoolName'),
      value: studentIrePP?.previousSchoolName,
    },
    {
      label: t('people:personal.enrolmentHistory.previousSchoolRollNumber'),
      value: studentIrePP?.previousSchoolRollNumber,
    },
    {
      label: t('people:personal.enrolmentHistory.leftEarly'),
      value: leftEarly,
      valueEditor: (
        <RHFCheckbox
          checkboxProps={{
            onChange: (event) => onChangeLeftEarlyState(event.target.checked),
          }}
          controlProps={{ name: 'leftEarly' }}
        />
      ),
      valueRenderer: leftEarly ? t('common:yes') : t('common:no'),
    },
    ...(leftEarlyState
      ? [
          {
            label: t('people:personal.enrolmentHistory.dateOfLeaving'),
            value: endDate ? dayjs(endDate).format('l') : null,
            valueRenderer: endDate ? dayjs(endDate).format('l') : '-',
            valueEditor: (
              <RHFDatePicker
                inputProps={{ variant: 'standard' }}
                controlProps={{ name: 'dateOfLeaving' }}
              />
            ),
          },
          {
            label: t('people:personal.enrolmentHistory.reasonOfDeparture'),
            value: studentIrePP?.reasonForLeaving,
            valueRenderer: studentIrePP?.reasonForLeaving
              ? t(
                  `people:personal.enrolmentHistory.studentLeavingReason.${studentIrePP?.reasonForLeaving}`
                )
              : null,
            valueEditor: (
              <RHFSelect
                options={Object.values(StudentLeavingReason)}
                variant="standard"
                controlProps={{ name: 'leavingReason' }}
                getOptionLabel={(option) =>
                  t(
                    `people:personal.enrolmentHistory.studentLeavingReason.${option}`
                  )
                }
                fullWidth
              />
            ),
          },
        ]
      : []),
  ];
};

type ProfileEnrolmentProps = {
  studentData: ReturnType<typeof useStudentPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<Partial<UpdateStudentInput>>['onSave'];
};

export const ProfileEnrolment = ({
  studentData,
  editable,
  onSave,
}: ProfileEnrolmentProps) => {
  const { t } = useTranslation(['people', 'common']);
  const { displayNames } = usePreferredNameLayout();
  const { resolver, rules } = useFormValidator<EnrolmentFormState>();

  const { leftEarly, studentIrePP, exemptions } = studentData || {};
  const {
    languageSupportApplicant,
    examEntrant,
    repeatYear,
    borderIndicator,
    boardingDays,
    shortTermPupil,
    shortTermPupilNumWeeks,
    destinationRollNo,
  } = studentIrePP || {};

  const [leftEarlyState, setLeftEarlyState] = useState(Boolean(leftEarly));

  const enrolmentDataWithLabels = getEnrolmentDataWithLabels(
    studentData,
    displayNames,
    t,
    leftEarlyState,
    setLeftEarlyState
  );

  const enrolmentResolver = resolver({
    dateOfLeaving: [rules.required(), rules.date()],
  });

  return (
    <CardEditableForm<EnrolmentFormState>
      resolver={enrolmentResolver}
      title={t('people:personal.enrolmentHistory.title')}
      editable={editable}
      fields={enrolmentDataWithLabels}
      onSave={onSave}
      onCancel={() => setLeftEarlyState(Boolean(leftEarly))}
    >
      <Stack component="dl" gap={3}>
        {[
          {
            label: t('people:personal.enrolmentHistory.exemptions'),
            value: exemptions?.length
              ? exemptions.map(({ id, exemption }) => ({
                  key: id,
                  value: exemption,
                }))
              : t('common:none'),
          },
          {
            label: t(
              'people:personal.enrolmentHistory.languageSupportApplicant'
            ),
            value: languageSupportApplicant ? t('common:yes') : t('common:no'),
          },
          {
            label: t('people:personal.enrolmentHistory.examEntrant'),
            value: examEntrant ? t('common:yes') : t('common:no'),
          },
          {
            label: t('people:personal.enrolmentHistory.repeatOfYearIndicator'),
            value: repeatYear ? t('common:yes') : t('common:no'),
          },
          {
            label: t('people:personal.enrolmentHistory.boarderIndicator'),
            value: borderIndicator ? t('common:yes') : t('common:no'),
          },
          borderIndicator && {
            label: t('people:personal.enrolmentHistory.boarderDays'),
            value: boardingDays,
          },
          {
            label: t('people:personal.enrolmentHistory.shortTermPupil'),
            value: shortTermPupil ? t('common:yes') : t('common:no'),
          },
          shortTermPupil && {
            label: t('people:personal.enrolmentHistory.numberOfWeeks'),
            value: t('common:weeks', { count: shortTermPupilNumWeeks ?? 0 }),
          },
          destinationRollNo && {
            label: t('people:personal.enrolmentHistory.destinationRollNumber'),
            value: destinationRollNo,
          },
        ]
          .filter(Boolean)
          .map(
            (field) =>
              field && (
                <Stack key={field.label}>
                  <Typography variant="subtitle1" component="dt">
                    {field.label}
                  </Typography>
                  {Array.isArray(field.value) ? (
                    field.value.map(({ key, value }) => (
                      <Typography key={key} variant="body1" component="dd">
                        {value}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body1">{field.value}</Typography>
                  )}
                </Stack>
              )
          )}
      </Stack>
    </CardEditableForm>
  );
};
