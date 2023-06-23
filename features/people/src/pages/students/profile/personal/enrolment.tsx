import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ReturnTypeDisplayNames,
  RHFTextField,
  usePreferredNameLayout,
} from '@tyro/core';
import { UpdateStudentInput } from '@tyro/api';
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';
import { useStudentPersonal } from '../../../../api/student/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';

type EnrolmentFormState = {
  lockerNumber: UpdateStudentInput['lockerNumber'];
  examNumber: UpdateStudentInput['examNumber'];
};

const getEnrolmentDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  displayNames: ReturnTypeDisplayNames,
  t: TFunction<'people'[]>
): CardEditableFormProps<EnrolmentFormState>['fields'] => {
  const {
    studentIrePP,
    startDate,
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
      label: t('people:personal.enrolmentHistory.programme'),
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
      label: t('people:personal.enrolmentHistory.previousSchoolRollNumber'),
      value: studentIrePP?.previousSchoolRollNumber,
    },
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

  const enrolmentDataWithLabels = getEnrolmentDataWithLabels(
    studentData,
    displayNames,
    t
  );

  const { leftEarly, studentIrePP, endDate } = studentData || {};
  const {
    languageSupportApplicant,
    examEntrant,
    repeatYear,
    borderIndicator,
    boardingDays,
    shortTermPupil,
    shortTermPupilNumWeeks,
    reasonForLeaving,
    destinationRollNo,
  } = studentIrePP || {};

  return (
    <CardEditableForm<EnrolmentFormState>
      title={t('people:personal.enrolmentHistory.title')}
      editable={editable}
      fields={enrolmentDataWithLabels}
      onSave={onSave}
    >
      <Stack gap={3}>
        {[
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
          {
            label: t('people:personal.enrolmentHistory.leftEarly'),
            value: leftEarly ? t('common:yes') : t('common:no'),
          },
          leftEarly && {
            label: t('people:personal.enrolmentHistory.dateOfLeaving'),
            value: endDate ? dayjs(endDate).format('l') : '-',
          },
          {
            label: t('people:personal.enrolmentHistory.reasonOfDeparture'),
            value: reasonForLeaving || '-',
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
                  <Typography variant="subtitle1">{field.label}</Typography>
                  <Typography variant="body1">{field.value}</Typography>
                </Stack>
              )
          )}
      </Stack>
    </CardEditableForm>
  );
};
