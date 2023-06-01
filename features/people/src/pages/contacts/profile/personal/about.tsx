import {
  RHFDatePicker,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  formatPhoneNumber,
  useFormValidator,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  PersonalTitle,
  PersonalInformation,
  PersonalInformationIre,
  InputAddress,
  StudentContact,
  InputEmailAddress,
  Gender,
} from '@tyro/api';
import dayjs from 'dayjs';
import { useContactPersonal } from '../../../../api/contact/personal';
import {
  MobileNumber,
  MobileNumberData,
} from '../../../../components/common/mobile-number';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { PersonalTitlesDropdown } from '../../../../components/common/personal-titles-dropdown';

type AboutFormState = {
  title: PersonalTitle;
  firstName: PersonalInformation['firstName'];
  lastName: PersonalInformation['lastName'];
  dateOfBirth: dayjs.Dayjs | null;
  gender: PersonalInformation['gender'];
  countryOfBirth: PersonalInformationIre['countryOfBirth'];
  nativeLanguage: StudentContact['nativeLanguage'];
  requiresInterpreter: StudentContact['requiresInterpreter'];
  line1: InputAddress['line1'];
  line2: InputAddress['line2'];
  line3: InputAddress['line3'];
  city: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
  primaryNumber: MobileNumberData | null;
  additionalNumber: MobileNumberData | null;
  primaryEmail: InputEmailAddress['email'];
  occupation: StudentContact['occupation'];
};

const genderOptions = Object.values(Gender);

const getAboutDataWithLabels = (
  data: ReturnType<typeof useContactPersonal>['data'],
  t: TFunction<('common' | 'people')[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const {
    partyId,
    personalInformation,
    nativeLanguage,
    requiresInterpreter,
    occupation,
  } = data || {};

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    ire,
    primaryAddress,
    primaryPhoneNumber,
    phoneNumbers = [],
    primaryEmail,
  } = personalInformation || {};

  const additionalNumber = phoneNumbers?.find(
    (phoneNumber) => !phoneNumber?.primaryPhoneNumber
  );

  const isPrimaryNumberAMobile = Boolean(primaryPhoneNumber?.countryCode);
  const isAdditionalNumberAMobile = Boolean(additionalNumber?.countryCode);

  return [
    {
      label: t('people:title'),
      value: null,
      valueEditor: (
        <PersonalTitlesDropdown
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'title' }}
        />
      ),
    },
    {
      label: t('people:personal.about.forename'),
      value: firstName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'firstName' }}
        />
      ),
    },
    {
      label: t('people:personal.about.surname'),
      value: lastName,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'lastName' }}
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
      label: t('people:tyroId'),
      value: partyId,
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
      label: t('people:personal.about.countryOfBirth'),
      value: ire?.countryOfBirth,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'countryOfBirth' }}
        />
      ),
    },
    {
      label: t('people:personal.about.spokenLanguage'),
      value: nativeLanguage,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'nativeLanguage' }}
        />
      ),
    },
    {
      label: t('people:personal.about.requiresInterpreter'),
      value: requiresInterpreter,
      valueRenderer: requiresInterpreter
        ? t('common:yes')
        : t('common:no') ?? '-',
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'requiresInterpreter' }}
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
      label: t('people:personal.about.primaryNumber'),
      value: isPrimaryNumberAMobile
        ? primaryPhoneNumber
        : primaryPhoneNumber?.number,
      valueRenderer: formatPhoneNumber(primaryPhoneNumber),
      valueEditor: isPrimaryNumberAMobile ? (
        <MobileNumber
          variant="standard"
          controlProps={{ name: 'primaryNumber' }}
        />
      ) : (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'primaryNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.about.additionalNumber'),
      value: isAdditionalNumberAMobile
        ? additionalNumber
        : additionalNumber?.number,
      valueRenderer: formatPhoneNumber(additionalNumber),
      valueEditor: isAdditionalNumberAMobile ? (
        <MobileNumber
          variant="standard"
          controlProps={{ name: 'additionalNumber' }}
        />
      ) : (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'additionalNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.about.email'),
      value: primaryEmail?.email,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'primaryEmail' }}
        />
      ),
    },
    {
      label: t('people:personal.about.occupation'),
      value: occupation,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'occupation' }}
        />
      ),
    },
  ];
};

type ProfileAboutProps = {
  contactData: ReturnType<typeof useContactPersonal>['data'];
  editable?: boolean;
};

export const ProfileAbout = ({ contactData, editable }: ProfileAboutProps) => {
  const { t } = useTranslation(['common', 'people']);

  const aboutDataWithLabels = getAboutDataWithLabels(contactData, t);

  const { resolver, rules } = useFormValidator<AboutFormState>();

  const aboutResolver = resolver({
    firstName: rules.required(),
    lastName: rules.required(),
    dateOfBirth: rules.date(),
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
    primaryEmail: rules.isEmail(),
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
