import { TFunction, useTranslation } from '@tyro/i18n';
import { formatPhoneNumber, RHFTextField, useFormValidator } from '@tyro/core';

import { InputEmailAddress, UpsertStaffInput } from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import {
  MobileNumber,
  MobileNumberData,
} from '../../../../components/common/mobile-number';

type ContactFormState = {
  primaryNumber: MobileNumberData | string | null;
  additionalNumber: MobileNumberData | string | null;
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

  const isPrimaryNumberAMobile = Boolean(primaryPhoneNumber?.countryCode);
  const isAdditionalNumberAMobile = Boolean(additionalNumber?.countryCode);

  return [
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
    onSave(
      {
        phoneNumbers: [
          primaryNumber
            ? {
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
                primaryPhoneNumber: false,
                active: true,
                number:
                  typeof additionalNumber === 'string'
                    ? additionalNumber
                    : additionalNumber.number,
                countryCode:
                  typeof additionalNumber === 'string'
                    ? undefined
                    : additionalNumber.countryCode,
              }
            : null,
        ].filter(Boolean),
        emails: [
          primaryEmail
            ? {
                primaryEmail: true,
                active: true,
                email: primaryEmail,
              }
            : null,
          additionalEmail
            ? {
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
