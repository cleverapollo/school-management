import { TFunction, useTranslation } from '@tyro/i18n';
import { RHFTextField, useFormValidator } from '@tyro/core';
import { InputNextOfKin } from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { MobileNumberData } from '../../../../components/common/mobile-number';

type EmergencyFormState = {
  firstName: InputNextOfKin['firstName'];
  lastName: InputNextOfKin['lastName'];
  primaryNumber: MobileNumberData | null;
  additionalNumber: MobileNumberData | null;
};

const getEmergencyDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<EmergencyFormState>['fields'] => {
  const { nextOfKin } = data?.personalInformation || {};

  const { phoneNumbers, firstName, lastName } = nextOfKin || {};
  const [primaryNumber, additionalNumber] = phoneNumbers || [];

  return [
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
      label: t('people:personal.about.primaryNumber'),
      value: primaryNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'primaryNumber' }}
        />
      ),
    },
    {
      label: t('people:personal.about.additionalNumber'),
      value: additionalNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'additionalNumber' }}
        />
      ),
    },
  ];
};

type ProfileEmergencyProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
};

export const ProfileEmergency = ({
  staffData,
  editable,
}: ProfileEmergencyProps) => {
  const { t } = useTranslation(['common', 'people']);

  const emergencyDataWithLabels = getEmergencyDataWitLabels(staffData, t);

  const { resolver, rules } = useFormValidator<EmergencyFormState>();

  const emergencyResolver = resolver({
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
  });

  const handleEdit = async (data: EmergencyFormState) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 300);
    });

  return (
    <CardEditableForm<EmergencyFormState>
      title={t('people:emergency')}
      editable={editable}
      fields={emergencyDataWithLabels}
      resolver={emergencyResolver}
      onSave={handleEdit}
    />
  );
};
