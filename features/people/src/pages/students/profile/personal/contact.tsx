import { TFunction, useTranslation } from '@tyro/i18n';
import { formatPhoneNumber, RHFTextField, useFormValidator } from '@tyro/core';

import { InputAddress, InputEmailAddress } from '@tyro/api';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import {
  MobileNumber,
  MobileNumberData,
} from '../../../../components/common/mobile-number';
import { useStudentPersonal } from '../../../../api/student/personal';

type ContactFormState = {
  primaryNumber: MobileNumberData | null;
  primaryEmail: InputEmailAddress['email'];
  line1: InputAddress['line1'];
  line2: InputAddress['line2'];
  line3: InputAddress['line3'];
  city: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
};

const getContactDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<ContactFormState>['fields'] => {
  const { primaryAddress, primaryPhoneNumber, primaryEmail } =
    data?.personalInformation || {};

  const isPrimaryNumberAMobile = Boolean(primaryPhoneNumber?.countryCode);

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
};

export const ProfileContact = ({
  studentData,
  editable,
}: ProfileContactProps) => {
  const { t } = useTranslation(['people']);

  const contactDataWithLabels = getContactDataWithLabels(studentData, t);

  const { resolver, rules } = useFormValidator<ContactFormState>();

  const contactResolver = resolver({
    primaryNumber: rules.isPhoneNumber(),
    primaryEmail: rules.isEmail(),
  });

  const handleEdit = async (data: ContactFormState) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 300);
    });

  return (
    <CardEditableForm<ContactFormState>
      title={t('people:personal.studentContactDetails')}
      editable={editable}
      fields={contactDataWithLabels}
      resolver={contactResolver}
      onSave={handleEdit}
      sx={{ height: '100%' }}
    />
  );
};
