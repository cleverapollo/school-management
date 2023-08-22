import { TFunction, useTranslation } from '@tyro/i18n';
import {
  formatPhoneNumber,
  RHFTextField,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';

import { InputAddress, UpdateStudentInput } from '@tyro/api';
import { useStudentPersonal } from '../../../../api/student/personal';
import { MobileNumberData } from '../../../../components/common/mobile-number';

type ContactFormState = {
  primaryPhoneNumber: MobileNumberData | string | null;
  primaryEmail: UpdateStudentInput['primaryEmail'];
  additionalLine1: InputAddress['line1'];
  additionalLine2: InputAddress['line2'];
  additionalLine3: InputAddress['line3'];
  additionalCity: InputAddress['city'];
  additionalCountry: InputAddress['country'];
  additionalEircode: InputAddress['postCode'];
};

const getContactDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<ContactFormState>['fields'] => {
  const {
    primaryAddress,
    primaryPhoneNumber,
    primaryEmail,
    addresses = [],
  } = data?.personalInformation || {};

  const additionalAddress = addresses?.find(
    (address) => !address?.primaryAddress
  );

  const hasAdditionalAddress = Boolean(additionalAddress);

  const isBasicNumber =
    primaryPhoneNumber?.number && !primaryPhoneNumber?.countryCode;

  return [
    {
      label: t('people:personal.about.addressLine1'),
      value: primaryAddress?.line1,
    },
    {
      label: t('people:personal.about.addressLine2'),
      value: primaryAddress?.line2,
    },
    {
      label: t('people:personal.about.addressLine3'),
      value: primaryAddress?.line3,
    },
    {
      label: t('people:personal.about.city'),
      value: primaryAddress?.city,
    },
    {
      label: t('people:personal.about.eircode'),
      value: primaryAddress?.postCode,
    },
    {
      label: t('people:personal.about.country'),
      value: primaryAddress?.country,
    },
    // TODO: uncomment when BE support updating the additional address
    // {
    //   label: t('people:personal.about.additionalAddressLine1'),
    //   value: additionalAddress?.line1,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalLine1' }}
    //     />
    //   ),
    // },
    // {
    //   label: t('people:personal.about.additionalAddressLine2'),
    //   value: additionalAddress?.line2,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalLine2' }}
    //     />
    //   ),
    // },
    // {
    //   label: t('people:personal.about.additionalAddressLine3'),
    //   value: additionalAddress?.line3,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalLine3' }}
    //     />
    //   ),
    // },
    // {
    //   label: t('people:personal.about.city'),
    //   value: additionalAddress?.city,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalCity' }}
    //     />
    //   ),
    // },
    // {
    //   label: t('people:personal.about.eircode'),
    //   value: additionalAddress?.postCode,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalEircode' }}
    //     />
    //   ),
    // },
    // {
    //   label: t('people:personal.about.country'),
    //   value: additionalAddress?.country,
    //   showOnlyOnEdition: !hasAdditionalAddress,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'additionalCountry' }}
    //     />
    //   ),
    // },
    // TODO: uncomment this when BE support PhoneInput payload at this moment is a string.
    // {
    //   label: t('people:personal.about.primaryNumber'),
    //   value: isBasicNumber ? primaryPhoneNumber?.number : primaryPhoneNumber,
    //   valueRenderer: formatPhoneNumber(primaryPhoneNumber),
    //   valueEditor: isBasicNumber ? (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'primaryPhoneNumber' }}
    //     />
    //   ) : (
    //     <MobileNumber
    //       variant="standard"
    //       controlProps={{ name: 'primaryPhoneNumber' }}
    //     />
    //   ),
    // },
    {
      label: t('people:personal.about.primaryNumber'),
      value: primaryPhoneNumber?.number,
      valueRenderer: formatPhoneNumber(primaryPhoneNumber),
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'primaryPhoneNumber' }}
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
  ];
};

type ProfileContactProps = {
  studentData: ReturnType<typeof useStudentPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<Partial<UpdateStudentInput>>['onSave'];
};

export const ProfileContact = ({
  studentData,
  editable,
  onSave,
}: ProfileContactProps) => {
  const { t } = useTranslation(['people']);

  const contactDataWithLabels = getContactDataWithLabels(studentData, t);

  const { resolver, rules } = useFormValidator<ContactFormState>();

  const contactResolver = resolver({
    primaryPhoneNumber: rules.isPhoneNumber(),
    primaryEmail: rules.isEmail(),
  });

  const handleEdit = (
    {
      primaryPhoneNumber,
      primaryEmail,
    }: // TODO: BE doesn't support yet update the following fields
    // additionalLine1,
    // additionalLine2,
    // additionalLine3,
    // additionalCity,
    // additionalCountry,
    // additionalEircode,
    ContactFormState,
    onSuccess: () => void
  ) => {
    onSave(
      {
        primaryPhoneNumber:
          typeof primaryPhoneNumber === 'string'
            ? primaryPhoneNumber
            : primaryPhoneNumber?.number,
        primaryEmail,
      },
      onSuccess
    );
  };

  return (
    <CardEditableForm<ContactFormState>
      title={t('people:personal.studentContactDetails')}
      editable={editable}
      fields={contactDataWithLabels}
      resolver={contactResolver}
      onSave={handleEdit}
    />
  );
};
