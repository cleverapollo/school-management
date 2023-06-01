import { TFunction, useTranslation } from '@tyro/i18n';
import { RHFTextField } from '@tyro/core';
import { useStudentPersonal } from '../../../../api/student/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';

type EnrolmentFormState = {
  lockerNumber: string;
  examNumber: string;
};

const getEnrolmentDataWithLabels = (
  _data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<('people' | 'common')[]>
): CardEditableFormProps<EnrolmentFormState>['fields'] => {
  const i18nPrefix = 'people:personal.enrolmentHistory';
  return [
    {
      label: t('common:academicYear'),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.enrolmentDate`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.programme`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.programmeYear`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.classGroup`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.classTutor`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.yearHead`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.lockerNumber`),
      value: null,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'lockerNumber' }}
        />
      ),
    },
    {
      label: t(`${i18nPrefix}.examNumber`),
      value: null,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'lockerNumber' }}
        />
      ),
    },
    {
      label: t(`${i18nPrefix}.examEntrant`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.repeatOfYearIndicator`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.boarderIndicator`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.boarderDays`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.shortTermPupil`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.numberOfWeeks`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.pupilSource`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.repeatLeavingCertificateFeesPayable`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.previousSchoolName`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.previousSchoolType`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.previousSchoolRollNumber`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.leftEarly`),
      value: null,
    },
    {
      label: t(`${i18nPrefix}.dateOfLeaving`),
      value: null,
    },
  ];
};

type ProfileEnrolmentProps = {
  studentData: ReturnType<typeof useStudentPersonal>['data'];
  editable?: boolean;
};

export const ProfileEnrolment = ({
  studentData,
  editable,
}: ProfileEnrolmentProps) => {
  const { t } = useTranslation(['people', 'common']);

  const enrolmentDataWithLabels = getEnrolmentDataWithLabels(studentData, t);

  const handleEdit = async (data: EnrolmentFormState) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 300);
    });

  return (
    <CardEditableForm<EnrolmentFormState>
      title={t('people:personal.enrolmentHistory.title')}
      editable={editable}
      fields={enrolmentDataWithLabels}
      onSave={handleEdit}
    />
  );
};
