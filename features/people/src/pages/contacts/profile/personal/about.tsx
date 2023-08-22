import {
  RHFSwitch,
  RHFTextField,
  formatPhoneNumber,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  PersonalTitle,
  PersonalInformation,
  InputAddress,
  StudentContact,
  InputEmailAddress,
  UpsertStudentContactInput,
} from '@tyro/api';
import { useContactPersonal } from '../../../../api/contact/personal';
import {
  MobileNumber,
  MobileNumberData,
} from '../../../../components/common/mobile-number';
import { PersonalTitlesDropdown } from '../../../../components/common/personal-titles-dropdown';
import { GenderDropdown } from '../../../../components/common/gender-dropdown';

type AboutFormState = {
  title: PersonalTitle | null;
  firstName: PersonalInformation['firstName'];
  lastName: PersonalInformation['lastName'];
  gender: PersonalInformation['gender'];
  spokenLanguage: string;
  requiresInterpreter: StudentContact['requiresInterpreter'];
  line1: InputAddress['line1'];
  line2: InputAddress['line2'];
  line3: InputAddress['line3'];
  city: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
  primaryNumber: MobileNumberData | string | null;
  additionalNumber: string | null;
  primaryEmail: InputEmailAddress['email'];
  occupation: StudentContact['occupation'];
};

const getAboutDataWithLabels = (
  data: ReturnType<typeof useContactPersonal>['data'],
  t: TFunction<('common' | 'people')[]>
): CardEditableFormProps<AboutFormState>['fields'] => {
  const {
    partyId,
    personalInformation,
    spokenLanguages,
    requiresInterpreter,
    occupation,
    person,
  } = data || {};

  const {
    firstName,
    lastName,
    gender,
    primaryAddress,
    primaryPhoneNumber,
    phoneNumbers = [],
    primaryEmail,
  } = personalInformation || {};

  const additionalNumber = phoneNumbers?.find(
    (phoneNumber) => !phoneNumber?.primaryPhoneNumber
  );

  const isBasicNumber =
    primaryPhoneNumber?.number && !primaryPhoneNumber?.countryCode;

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
      label: t('people:gender.title'),
      value: gender,
      valueRenderer: gender ? t(`people:gender.${gender}`) : '-',
      valueEditor: (
        <GenderDropdown variant="standard" controlProps={{ name: 'gender' }} />
      ),
    },
    {
      label: t('people:personal.about.spokenLanguage'),
      value: (spokenLanguages || [])[0],
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'spokenLanguage' }}
        />
      ),
    },
    {
      label: t('people:personal.about.requiresInterpreter'),
      value: requiresInterpreter,
      valueRenderer: requiresInterpreter ? t('common:yes') : t('common:no'),
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
      value: isBasicNumber ? primaryPhoneNumber?.number : primaryPhoneNumber,
      valueRenderer: formatPhoneNumber(primaryPhoneNumber),
      valueEditor: isBasicNumber ? (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'primaryNumber' }}
        />
      ) : (
        <MobileNumber
          variant="standard"
          controlProps={{ name: 'primaryNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.about.additionalNumber'),
      value: additionalNumber?.number,
      valueRenderer: formatPhoneNumber(additionalNumber),
      valueEditor: (
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
    {
      label: t('people:tyroId'),
      value: partyId,
    },
  ];
};

type ProfileAboutProps = {
  contactData: ReturnType<typeof useContactPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<
    Omit<UpsertStudentContactInput, 'studentRelationships'>
  >['onSave'];
};

export const ProfileAbout = ({
  contactData,
  editable,
  onSave,
}: ProfileAboutProps) => {
  const { t } = useTranslation(['common', 'people']);

  const aboutDataWithLabels = getAboutDataWithLabels(contactData, t);

  const { resolver, rules } = useFormValidator<AboutFormState>();

  const aboutResolver = resolver({
    firstName: rules.required(),
    lastName: rules.required(),
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
    primaryEmail: rules.isEmail(),
  });

  const handleEdit = (
    {
      title,
      firstName,
      lastName,
      primaryNumber,
      additionalNumber,
      primaryEmail,
      line1,
      line2,
      line3,
      eircode: postCode,
      city,
      country,
      spokenLanguage,
      gender,
      ...data
    }: AboutFormState,
    onSuccess: () => void
  ) => {
    const hasAddress = city || country || line1 || line2 || line3 || postCode;

    const {
      phoneNumbers = [],
      primaryAddress,
      primaryPhoneNumber: currentPrimaryPhoneNumer,
      primaryEmail: currentPrimaryEmail,
    } = contactData?.personalInformation || {};

    const currentAdditionalNumber = phoneNumbers?.find(
      (phoneNumber) => !phoneNumber?.primaryPhoneNumber
    );

    return onSave(
      {
        titleId: title?.id,
        personal: {
          firstName,
          lastName,
          gender,
        },
        phoneNumbers: [
          primaryNumber
            ? {
                phoneNumberId: currentPrimaryPhoneNumer?.phoneNumberId,
                primaryPhoneNumber: true,
                active: true,
                number:
                  typeof primaryNumber === 'string'
                    ? primaryNumber
                    : primaryNumber.number,
                countryCode:
                  typeof primaryNumber === 'string'
                    ? undefined
                    : primaryNumber.countryCode,
              }
            : null,
          additionalNumber
            ? {
                phoneNumberId: currentAdditionalNumber?.phoneNumberId,
                primaryPhoneNumber: false,
                active: true,
                number: additionalNumber,
                countryCode: undefined,
              }
            : null,
        ].filter(Boolean),
        ...(primaryEmail && {
          emails: [
            {
              emailId: currentPrimaryEmail?.emailId,
              primaryEmail: true,
              active: true,
              email: primaryEmail,
            },
          ],
        }),
        ...(hasAddress && {
          addresses: [
            {
              addressId: primaryAddress?.id,
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
        ...(spokenLanguage && {
          spokenLanguages: [spokenLanguage],
        }),
        ...data,
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
