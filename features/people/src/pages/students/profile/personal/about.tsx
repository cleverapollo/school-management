import { TFunction, useTranslation } from '@tyro/i18n';
import { PersonalInformation } from '@tyro/api';
import { RHFTextField } from '@tyro/core';
import { Stack, Typography, Chip } from '@mui/material';
import { UserGroupTwoIcon } from '@tyro/icons';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { useStudentPersonal } from '../../../../api/student/personal';

type AboutFormState = {
  preferredName: PersonalInformation['preferredFirstName'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const { partyId, personalInformation } = data || {};
  const {
    preferredFirstName,
    firstName,
    lastName,
    dateOfBirth,
    ire,
    gender,
    nationality,
    mothersMaidenName,
  } = personalInformation || {};

  return [
    {
      label: t('people:personal.about.preferredName'),
      value: preferredFirstName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'preferredName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.forename'),
      value: firstName,
    },
    {
      label: t('people:personal.about.surname'),
      value: lastName,
    },
    {
      label: t('people:personal.about.dateOfBirth'),
      value: dateOfBirth,
      valueRenderer: dateOfBirth ? dateOfBirth.format('DD/MM/YYYY') : '-',
    },
    {
      label: t('people:ppsNumber'),
      value: ire?.ppsNumber,
    },
    {
      label: t('people:personal.about.departmentId'),
      value: null,
    },
    {
      label: t('people:gender.title'),
      value: gender,
      valueRenderer: gender ? t(`people:gender.${gender}`) : '-',
    },
    {
      label: t('people:personal.about.birthCertForename'),
      value: null,
    },
    {
      label: t('people:personal.about.birthCertSurname'),
      value: null,
    },
    {
      label: t('people:tyroId'),
      value: partyId,
    },
    {
      label: t('people:personal.about.countryOfBirth'),
      value: ire?.countryOfBirth,
    },
    {
      label: t('people:personal.about.nationality'),
      value: nationality,
    },
    {
      label: t('people:personal.about.mothersMaidenName'),
      value: mothersMaidenName,
    },
    {
      label: t('people:personal.about.motherTongue'),
      value: null,
    },
    {
      label: t('people:personal.about.ethnicityAndCulturalBackground'),
      value: null,
    },
  ];
};

type ProfileAboutProps = {
  studentData: ReturnType<typeof useStudentPersonal>['data'];
  editable?: boolean;
};

export const ProfileAbout = ({ studentData, editable }: ProfileAboutProps) => {
  const { t } = useTranslation(['common', 'people']);

  const aboutDataWithLabels = getAboutDataWithLabels(studentData, t);

  const handleEdit = async (data: AboutFormState) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 300);
    });

  return (
    <CardEditableForm<AboutFormState>
      title={t('people:personal.about.title')}
      editable={editable}
      fields={aboutDataWithLabels}
      onSave={handleEdit}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <UserGroupTwoIcon sx={{ color: 'slate.500' }} />
        <Typography variant="body1" sx={{ color: 'slate.600' }}>
          {t('common:siblings')}
        </Typography>
        <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />
      </Stack>
    </CardEditableForm>
  );
};
