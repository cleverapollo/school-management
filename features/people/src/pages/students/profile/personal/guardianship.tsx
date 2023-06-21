import { TFunction, useTranslation } from '@tyro/i18n';
import { UpdateStudentInput } from '@tyro/api';
import { RHFTextField, useFormValidator } from '@tyro/core';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { useStudentPersonal } from '../../../../api/student/personal';

type GuardianshipFormState = {
  // description?: string;
};

const getGuardianshipWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'common'[]>
): CardEditableFormProps<GuardianshipFormState>['fields'] => [
  {
    label: t('common:description'),
    value: null,
    valueEditor: (
      <RHFTextField
        controlProps={{ name: 'description' }}
        textFieldProps={{
          fullWidth: true,
          variant: 'standard',
          multiline: true,
          rows: 4,
        }}
      />
    ),
  },
];

type ProfileGuardianshipProps = {
  studentData: ReturnType<typeof useStudentPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<Partial<UpdateStudentInput>>['onSave'];
};

export const ProfileGuardianship = ({
  studentData,
  editable,
  onSave,
}: ProfileGuardianshipProps) => {
  const { t } = useTranslation(['common', 'people']);

  const guardianDataWithLabels = getGuardianshipWithLabels(studentData, t);
  const { resolver, rules } = useFormValidator<GuardianshipFormState>();

  const guardianshipResolver = resolver({
    description: rules.maxLength(500),
  });

  return (
    <CardEditableForm<GuardianshipFormState>
      title={t('people:personal.guardianship')}
      editable={editable}
      fields={guardianDataWithLabels}
      resolver={guardianshipResolver}
      onSave={onSave}
      sx={{ height: '100%' }}
    />
  );
};
