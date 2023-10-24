import { TFunction, useTranslation } from '@tyro/i18n';
import { PersonalInformation, UpdateStudentInput } from '@tyro/api';
import {
  RHFTextField,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import { Stack, Typography } from '@mui/material';
import { UserGroupTwoIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStudentPersonal } from '../../../../api/student/personal';
import { SiblingsChips } from '../../../../components/students/sibling-chips';

dayjs.extend(LocalizedFormat);

type AboutFormState = {
  preferredFirstName: PersonalInformation['preferredFirstName'];
  preferredLastName: PersonalInformation['preferredLastName'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<('common' | 'people')[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const { partyId, personalInformation, studentIrePP } = data || {};
  const {
    preferredFirstName,
    firstName,
    preferredLastName,
    lastName,
    middleName,
    dateOfBirth,
    ire,
    gender,
    nationality,
    mothersMaidenName,
    birthCertFirstName,
    birthCertLastName,
  } = personalInformation || {};

  return [
    {
      label: t('people:personal.about.preferredFirstName'),
      value: preferredFirstName,
      tooltipInfo: t('people:preferredFirstNameInfo'),
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'preferredFirstName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.preferredLastName'),
      value: preferredLastName,
      tooltipInfo: t('people:preferredLastNameInfo'),
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'preferredLastName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.forename'),
      value: firstName,
    },
    {
      label: t('people:personal.about.middleName'),
      value: middleName,
    },

    {
      label: t('people:personal.about.surname'),
      value: lastName,
    },
    {
      label: t('people:dateOfBirth'),
      value: dateOfBirth ? dayjs(dateOfBirth) : null,
      valueRenderer: dateOfBirth ? dayjs(dateOfBirth).format('l') : '-',
    },
    {
      label: t('people:ppsNumber'),
      value: ire?.ppsNumber,
    },
    {
      label: t('people:personal.about.departmentId'),
      value: studentIrePP?.dpin,
    },
    {
      label: t('people:gender.title'),
      value: gender,
      valueRenderer: gender ? t(`people:gender.${gender}`) : '-',
    },
    {
      label: t('people:personal.about.birthCertForename'),
      value: birthCertFirstName,
    },
    {
      label: t('people:personal.about.birthCertSurname'),
      value: birthCertLastName,
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
      label: t('people:personal.about.memberOfTravellerCommunity'),
      value: studentIrePP?.travellerHeritage,
      valueRenderer: studentIrePP?.travellerHeritage
        ? t('common:yes')
        : t('common:no'),
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
        <SiblingsChips
          currentStudent={studentData?.person ?? { partyId: 0 }}
          siblings={studentData?.siblings}
        />
      </Stack>
    </CardEditableForm>
  );
};
