import { Chip, Stack } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  RHFDatePicker,
  RHFSwitch,
  useFormValidator,
} from '@tyro/core';
import dayjs from 'dayjs';

import { UpsertStaffInput, getColorBasedOnIndex, StaffIre } from '@tyro/api';
import { CatalogueSubjectOption } from '@tyro/settings';
import { EmploymentCapacityAutocomplete } from '../../../../components/common/employment-capacity-autocomplete';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';
import { StaffPostsAutocomplete } from '../../../../components/common/staff-posts-autocomplete';
import { CompetencySubjectsAutocomplete } from '../../../../components/common/competency-subjects-autocomplete';
import { StaffPostsOption } from '../../../../api/staff/staff-posts';
import { EmploymentCapacityOption } from '../../../../api/staff/employment-capacities';

type EmploymentFormState = {
  position: UpsertStaffInput['position'];
  employmentCapacity: EmploymentCapacityOption;
  post: StaffPostsOption | null;
  payrollNumber: UpsertStaffInput['payrollNumber'];
  teacherCouncilNumber: StaffIre['teacherCouncilNumber'];
  startDate: dayjs.Dayjs | null;
  qualifications: UpsertStaffInput['qualifications'];
  jobSharing: UpsertStaffInput['jobSharing'];
  availableForTeaching: UpsertStaffInput['availableForTeaching'];
  availableForSubstitution: UpsertStaffInput['availableForSubstitution'];
  availableForSupportClasses: UpsertStaffInput['availableForSupportClasses'];
  displayCode: UpsertStaffInput['displayCode'];
  competencies: CatalogueSubjectOption[] | null;
};

const getEmploymentDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<('people' | 'common')[]>
): CardEditableFormProps<EmploymentFormState>['fields'] => {
  const {
    payrollNumber,
    employmentCapacity,
    position,
    staffIre,
    startDate,
    endDate,
    displayCode,
    jobSharing,
    qualifications,
    availableForTeaching,
    availableForSubstitution,
    availableForSupportClasses,
    competencySubjects = [],
  } = data || {};

  return [
    {
      label: t('people:position'),
      value: position,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'position' }}
        />
      ),
    },
    {
      label: t('people:capacity'),
      value: employmentCapacity,
      valueRenderer: employmentCapacity?.name,
      valueEditor: (
        <EmploymentCapacityAutocomplete
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'employmentCapacity' }}
        />
      ),
    },
    {
      label: t('people:post'),
      value: staffIre?.staffPost,
      valueRenderer: staffIre?.staffPost?.name,
      valueEditor: (
        <StaffPostsAutocomplete
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'post' }}
        />
      ),
    },
    {
      label: t('people:payrollNumber'),
      value: payrollNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'payrollNumber' }}
        />
      ),
    },
    {
      label: t('people:teacherCouncilNumber'),
      value: staffIre?.teacherCouncilNumber,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'teacherCouncilNumber' }}
        />
      ),
    },
    {
      label: t('people:dateOfEmployment'),
      valueRenderer: startDate
        ? `${dayjs(startDate).format('DD/MM/YYYY')} - ${
            endDate ? dayjs(endDate).format('DD/MM/YYYY') : t('people:present')
          }`
        : '-',
      value: startDate ? dayjs(startDate) : null,
      valueEditor: (
        <RHFDatePicker
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'startDate' }}
        />
      ),
    },
    {
      label: t('people:qualifications'),
      value: qualifications,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'qualifications' }}
        />
      ),
    },
    {
      label: t('people:jobSharing'),
      value: jobSharing,
      valueRenderer: jobSharing ? t('common:yes') : t('common:no'),
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'jobSharing' }}
        />
      ),
    },
    {
      label: t('people:availableForTeaching'),
      value: availableForTeaching,
      valueRenderer: availableForTeaching ? t('common:yes') : t('common:no'),
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForTeaching' }}
        />
      ),
    },
    {
      label: t('people:availableForSubstitution'),
      value: availableForSubstitution,
      valueRenderer: availableForSubstitution
        ? t('common:yes')
        : t('common:no'),
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForSubstitution' }}
        />
      ),
    },
    {
      label: t('people:availableForSupportClasses'),
      value: availableForSupportClasses,
      valueRenderer: availableForSupportClasses
        ? t('common:yes')
        : t('common:no'),
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForSupportClasses' }}
        />
      ),
    },
    {
      label: t('people:displayCode'),
      value: displayCode,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'displayCode' }}
        />
      ),
    },
    {
      label: t('people:competencies'),
      value: competencySubjects,
      valueRenderer:
        competencySubjects.length > 0 ? (
          <Stack flexDirection="row" flexWrap="wrap" gap={0.5}>
            {competencySubjects.map(({ name, colour }, index) => (
              <Chip
                key={name}
                color={colour || getColorBasedOnIndex(index)}
                label={name}
              />
            ))}
          </Stack>
        ) : (
          '-'
        ),
      valueEditor: (
        <CompetencySubjectsAutocomplete
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'competencies' }}
        />
      ),
    },
  ];
};

type ProfileEmploymentProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<UpsertStaffInput>['onSave'];
};

export const ProfileEmployment = ({
  staffData,
  editable,
  onSave,
}: ProfileEmploymentProps) => {
  const { t } = useTranslation(['common', 'people']);

  const employmentDataWithLabels = getEmploymentDataWitLabels(staffData, t);

  const { resolver, rules } = useFormValidator<EmploymentFormState>();

  const employmentResolver = resolver({
    startDate: rules.date(),
    employmentCapacity: rules.required(),
  });

  const handleEdit = (
    {
      employmentCapacity,
      startDate,
      competencies,
      post,
      teacherCouncilNumber,
      ...data
    }: EmploymentFormState,
    onSuccess: () => void
  ) =>
    onSave(
      {
        employmentCapacity: employmentCapacity.id,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        competencies: competencies?.map((competency) => competency.id),
        staffIre: {
          staffPost: post?.id,
          teacherCouncilNumber,
        },
        ...data,
      },
      onSuccess
    );

  return (
    <CardEditableForm<EmploymentFormState>
      title={t('people:employment')}
      editable={editable}
      fields={employmentDataWithLabels}
      resolver={employmentResolver}
      onSave={handleEdit}
      sx={{ height: '100%' }}
    />
  );
};
