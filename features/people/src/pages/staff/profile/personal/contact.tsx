import { TFunction, useTranslation } from '@tyro/i18n';
import {
  formatPhoneNumber,
  RHFTextField,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';

import { InputEmailAddress, UpsertStaffInput } from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  MobileNumber,
  MobileNumberData,
} from '../../../../components/common/mobile-number';

type ContactFormState = {
  primaryNumber: MobileNumberData | string | null;
  additionalNumber: string | null;
  primaryEmail: InputEmailAddress['email'];
  additionalEmail: InputEmailAddress['email'];
};

const getContactDataWithLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<ContactFormState>['fields'] => {
  const {
    primaryPhoneNumber,
    phoneNumbers = [],
    primaryEmail,
    emails = [],
  } = data?.personalInformation || {};

  const additionalNumber = phoneNumbers?.find(
    (phoneNumber) => !phoneNumber?.primaryPhoneNumber
  );
  const additionalEmail = emails?.find((email) => !email?.primaryEmail);

  const isBasicNumber =
    primaryPhoneNumber?.number && !primaryPhoneNumber?.countryCode;

  return [
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
      label: t('people:personal.about.additionalEmail'),
      value: additionalEmail?.email,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'additionalEmail' }}
        />
      ),
    },
  ];
};

type ProfileContactProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<UpsertStaffInput>['onSave'];
};

export const ProfileContact = ({
  staffData,
  editable,
  onSave,
}: ProfileContactProps) => {
  const { t } = useTranslation(['common', 'people']);

  const contactDataWithLabels = getContactDataWithLabels(staffData, t);

  const { resolver, rules } = useFormValidator<ContactFormState>();

  const contactResolver = resolver({
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
    primaryEmail: rules.isEmail(),
    additionalEmail: rules.isEmail(),
  });

  const handleEdit = (
    {
      primaryNumber,
      additionalNumber,
      primaryEmail,
      additionalEmail,
    }: ContactFormState,
    onSuccess: () => void
  ) => {
    const {
      phoneNumbers = [],
      emails = [],
      primaryPhoneNumber: currentPrimaryPhoneNumer,
      primaryEmail: currentPrimaryEmail,
    } = staffData?.personalInformation || {};

    const currentAdditionalNumber = phoneNumbers?.find(
      (phoneNumber) => !phoneNumber?.primaryPhoneNumber
    );
    const currentAdditionalEmail = emails?.find(
      (email) => !email?.primaryEmail
    );

    onSave(
      {
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
        emails: [
          primaryEmail
            ? {
                emailId: currentPrimaryEmail?.emailId,
                primaryEmail: true,
                active: true,
                email: primaryEmail,
              }
            : null,
          additionalEmail
            ? {
                emailId: currentAdditionalEmail?.emailId,
                primaryEmail: false,
                active: true,
                email: additionalEmail,
              }
            : null,
        ].filter(Boolean),
      },
      onSuccess
    );
  };

  return (
    <CardEditableForm<ContactFormState>
      title={t('common:contact')}
      editable={editable}
      fields={contactDataWithLabels}
      resolver={contactResolver}
      onSave={handleEdit}
      sx={{ height: '100%' }}
    />
  );
};
