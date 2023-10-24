import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  RHFDatePicker,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import dayjs from 'dayjs';

import { UpsertStaffInput, InputAddress, PersonalTitle } from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';
import { PersonalTitlesDropdown } from '../../../../components/common/personal-titles-dropdown';
import { GenderDropdown } from '../../../../components/common/gender-dropdown';

type AboutFormState = {
  title: PersonalTitle | null;
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
  makeAndModel: UpsertStaffInput['makeAndModel'];
  parking: UpsertStaffInput['parking'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const {
    person,
    personalInformation,
    carRegistrationNumber,
    makeAndModel,
    parking,
  } = data || {};
  const { gender, dateOfBirth, ire, primaryAddress } =
    personalInformation || {};

  return [
    {
      label: t('people:title'),
      value: person?.title,
      valueRenderer: person?.title?.name,
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
        <GenderDropdown variant="standard" controlProps={{ name: 'gender' }} />
      ),
    },
    {
      label: t('people:dateOfBirth'),
      value: dateOfBirth ? dayjs(dateOfBirth) : null,
      valueRenderer: dateOfBirth ? dayjs(dateOfBirth).format('l') : '-',
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
    {
      label: t('people:makeAndModel'),
      value: makeAndModel,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'makeAndModel' }}
        />
      ),
    },
    {
      label: t('people:parkingLocation'),
      value: parking,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'parking' }}
        />
      ),
    },
  ];
};

type ProfileAboutProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<UpsertStaffInput>['onSave'];
};

export const ProfileAbout = ({
  staffData,
  editable,
  onSave,
}: ProfileAboutProps) => {
  const { t } = useTranslation(['people']);

  const aboutDataWithLabels = getAboutDataWithLabels(staffData, t);

  const { resolver, rules } = useFormValidator<AboutFormState>();

  const aboutResolver = resolver({
    firstName: rules.required(),
    lastName: rules.required(),
    dateOfBirth: rules.date(),
  });

  const handleEdit = (
    {
      title,
      dateOfBirth,
      ppsNumber,
      line1,
      line2,
      line3,
      eircode: postCode,
      city,
      country,
      ...data
    }: AboutFormState,
    onSuccess: () => void
  ) => {
    const hasAddress = city || country || line1 || line2 || line3 || postCode;

    return onSave(
      {
        ...data,
        id: staffData?.partyId,
        titleId: title?.id,
        dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : undefined,
        staffIre: {
          pps: ppsNumber,
        },
        ...(hasAddress && {
          addresses: [
            {
              addressId: staffData?.personalInformation?.primaryAddress?.id,
              primaryAddress: true,
              active: true,
              city,
              country,
              line1,
              line2,
              line3,
              postCode,
            },
          ],
        }),
      },
      onSuccess
    );
  };

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
