import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  RHFSelect,
  RHFDatePicker,
  useFormValidator,
} from '@tyro/core';
import dayjs from 'dayjs';

import {
  UpsertStaffInput,
  Gender,
  InputAddress,
  PersonalTitle,
} from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { PersonalTitlesDropdown } from '../../../../components/common/personal-titles-dropdown';

const genderOptions = Object.values(Gender);

type AboutFormState = {
  title: PersonalTitle;
  firstName: UpsertStaffInput['firstName'];
  lastName: UpsertStaffInput['lastName'];
  gender: UpsertStaffInput['gender'];
  dateOfBirth: dayjs.Dayjs | null;
  ppsNumber: string | null | undefined;
  line1: InputAddress['line1'];
  line2: InputAddress['line2'];
  line3: InputAddress['line3'];
  city: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
  carRegistrationNumber: UpsertStaffInput['carRegistrationNumber'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const { person, personalInformation, carRegistrationNumber } = data || {};
  const { gender, dateOfBirth, ire, primaryAddress } =
    personalInformation || {};

  return [
    {
      label: t('people:title'),
      value: person?.title,
      valueEditor: (
        <PersonalTitlesDropdown
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'title' }}
        />
      ),
    },
    {
      label: t('people:personal.about.forename'),
      value: person?.firstName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'firstName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.surname'),
      value: person?.lastName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'lastName' }}
        />
      ),
    },
    {
      label: t('people:gender.title'),
      value: gender,
      valueRenderer: gender ? t(`people:gender.${gender}`) : '-',
      valueEditor: (
        <RHFSelect<AboutFormState, Gender>
          variant="standard"
          fullWidth
          options={genderOptions}
          getOptionLabel={(option) => t(`people:gender.${option}`)}
          controlProps={{ name: 'gender' }}
        />
      ),
    },
    {
      label: t('people:personal.about.dateOfBirth'),
      value: dateOfBirth ? dayjs(dateOfBirth) : undefined,
      valueRenderer: dateOfBirth
        ? dayjs(dateOfBirth).format('DD/MM/YYYY')
        : '-',
      valueEditor: (
        <RHFDatePicker
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'dateOfBirth' }}
        />
      ),
    },
    {
      label: t('people:ppsNumber'),
      value: ire?.ppsNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'ppsNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.about.addressLine1'),
      value: primaryAddress?.line1,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'line1' }}
        />
      ),
    },
    {
      label: t('people:personal.about.addressLine2'),
      value: primaryAddress?.line2,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'line2' }}
        />
      ),
    },
    {
      label: t('people:personal.about.addressLine3'),
      value: primaryAddress?.line3,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'line3' }}
        />
      ),
    },
    {
      label: t('people:personal.about.city'),
      value: primaryAddress?.city,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'city' }}
        />
      ),
    },
    {
      label: t('people:personal.about.eircode'),
      value: primaryAddress?.postCode,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'eircode' }}
        />
      ),
    },
    {
      label: t('people:personal.about.country'),
      value: primaryAddress?.country,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'country' }}
        />
      ),
    },
    {
      label: t('people:carRegistration'),
      value: carRegistrationNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'carRegistrationNumber' }}
        />
      ),
    },
  ];
};

type ProfileAboutProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
};

export const ProfileAbout = ({ staffData, editable }: ProfileAboutProps) => {
  const { t } = useTranslation(['people']);

  const aboutDataWithLabels = getAboutDataWithLabels(staffData, t);

  const { resolver, rules } = useFormValidator<AboutFormState>();

  const aboutResolver = resolver({
    firstName: rules.required(),
    lastName: rules.required(),
    dateOfBirth: rules.date(),
  });

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
      resolver={aboutResolver}
      onSave={handleEdit}
    />
  );
};
