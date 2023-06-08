import { TFunction, useTranslation } from '@tyro/i18n';
import { RHFTextField, useFormValidator } from '@tyro/core';
import { StaffEmergencyContact, UpsertStaffInput } from '@tyro/api';
import { useMemo } from 'react';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';

type EmergencyFormState = {
  firstName: StaffEmergencyContact['firstName'];
  lastName: StaffEmergencyContact['lastName'];
  primaryNumber: StaffEmergencyContact['primaryNumber'];
  additionalNumber: StaffEmergencyContact['additionalNumber'];
};

const getEmergencyDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
): CardEditableFormProps<EmergencyFormState>['fields'] => {
  const { firstName, lastName, primaryNumber, additionalNumber } =
    data?.emergencyContact || {};

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
  onSave: (data: UpsertStaffInput) => void;
};

export const ProfileEmergency = ({
  staffData,
  editable,
  onSave,
}: ProfileEmergencyProps) => {
  const { t } = useTranslation(['common', 'people']);

  const emergencyDataWithLabels = useMemo(
    () => getEmergencyDataWitLabels(staffData, t),
    [staffData]
  );

  const { resolver, rules } = useFormValidator<EmergencyFormState>();

  const emergencyResolver = resolver({
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
  });

  const handleEdit = (emergencyContact: EmergencyFormState) =>
    onSave({ emergencyContact });

  return (
    <CardEditableForm<EmergencyFormState>
      title={t('people:emergency')}
      editable={editable}
      fields={emergencyDataWithLabels}
      resolver={emergencyResolver}
      onSave={handleEdit}
      sx={{ height: '100%' }}
    />
  );
};
