import { TFunction, useTranslation } from '@tyro/i18n';
import { PersonalInformation, UpdateStudentInput } from '@tyro/api';
import { RHFTextField } from '@tyro/core';
import { Chip, Stack, Typography } from '@mui/material';
import { UserGroupTwoIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { useStudentPersonal } from '../../../../api/student/personal';

dayjs.extend(LocalizedFormat);

type AboutFormState = {
  preferredFirstName: PersonalInformation['preferredFirstName'];
  preferredLastName: PersonalInformation['preferredLastName'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const { partyId, personalInformation } = data || {};
  const {
    preferredFirstName,
    firstName,
    preferredLastName,
    lastName,
    dateOfBirth,
    ire,
    gender,
    nationality,
    mothersMaidenName,
  } = personalInformation || {};

  return [
    {
      label: t('people:personal.about.preferredFirstName'),
      value: preferredFirstName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'preferredFirstName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.forename'),
      value: firstName,
    },
    {
      label: t('people:personal.about.preferredLastName'),
      value: preferredLastName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'preferredLastName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.surname'),
      value: lastName,
    },
    {
      label: t('people:personal.about.dateOfBirth'),
      value: dateOfBirth,
      valueRenderer: dateOfBirth ? dayjs(dateOfBirth).format('l') : '-',
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
  onSave: CardEditableFormProps<Partial<UpdateStudentInput>>['onSave'];
};

export const ProfileAbout = ({
  studentData,
  editable,
  onSave,
}: ProfileAboutProps) => {
  const { t } = useTranslation(['common', 'people']);

  const aboutDataWithLabels = getAboutDataWithLabels(studentData, t);

  return (
    <CardEditableForm<AboutFormState>
      title={t('people:personal.about.title')}
      editable={editable}
      fields={aboutDataWithLabels}
      onSave={onSave}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <UserGroupTwoIcon sx={{ color: 'text.secondary' }} />
        <Typography variant="body1" color="text.primary">
          {t('common:siblings')}
        </Typography>
        <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />
      </Stack>
    </CardEditableForm>
  );
};
