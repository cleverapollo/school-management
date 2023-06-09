import { TFunction, useTranslation } from '@tyro/i18n';
import { formatPhoneNumber, RHFTextField, useFormValidator } from '@tyro/core';

import { UpdateStudentInput } from '@tyro/api';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { useStudentPersonal } from '../../../../api/student/personal';

type ContactFormState = {
  primaryPhoneNumber: UpdateStudentInput['primaryPhoneNumber'];
  primaryEmail: UpdateStudentInput['primaryEmail'];
};

const getContactDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<ContactFormState>['fields'] => {
  const { primaryAddress, primaryPhoneNumber, primaryEmail } =
    data?.personalInformation || {};

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

  return (
    <CardEditableForm<ContactFormState>
      title={t('people:personal.studentContactDetails')}
      editable={editable}
      fields={contactDataWithLabels}
      resolver={contactResolver}
      onSave={onSave}
      sx={{ height: '100%' }}
    />
  );
};
