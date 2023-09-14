import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import { StaffEmergencyContact, UpsertStaffInput } from '@tyro/api';
import { useStaffPersonal } from '../../../../api/staff/personal';

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
  onSave: CardEditableFormProps<UpsertStaffInput>['onSave'];
};

export const ProfileEmergency = ({
  staffData,
  editable,
  onSave,
}: ProfileEmergencyProps) => {
  const { t } = useTranslation(['common', 'people']);

  const emergencyDataWithLabels = getEmergencyDataWitLabels(staffData, t);

  const { resolver, rules } = useFormValidator<EmergencyFormState>();

  const emergencyResolver = resolver({
    primaryNumber: rules.isPhoneNumber(),
    additionalNumber: rules.isPhoneNumber(),
  });

  const handleEdit = (
    emergencyContact: EmergencyFormState,
    onSuccess: () => void
  ) => onSave({ emergencyContact }, onSuccess);

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
