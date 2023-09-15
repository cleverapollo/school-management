import { Dispatch, SetStateAction, useState } from 'react';
import { Chip, Stack } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  RHFDatePicker,
  RHFSwitch,
  useFormValidator,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import dayjs from 'dayjs';

import { UpsertStaffInput, getColorBasedOnIndex, StaffIre } from '@tyro/api';
import { CatalogueSubjectOption } from '@tyro/settings';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { EmploymentCapacityAutocomplete } from '../../../../components/common/employment-capacity-autocomplete';
import { useStaffPersonal } from '../../../../api/staff/personal';
import { StaffPostsAutocomplete } from '../../../../components/common/staff-posts-autocomplete';
import { CompetencySubjectsAutocomplete } from '../../../../components/common/competency-subjects-autocomplete';
import { StaffPostsOption } from '../../../../api/staff/staff-posts';
import { EmploymentCapacityOption } from '../../../../api/staff/employment-capacities';

dayjs.extend(LocalizedFormat);

type EmploymentFormState = {
  position: UpsertStaffInput['position'];
  employmentCapacity: EmploymentCapacityOption;
  post: StaffPostsOption | null;
  payrollNumber: UpsertStaffInput['payrollNumber'];
  teacherCouncilNumber: StaffIre['teacherCouncilNumber'];
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  currentEmployee: boolean;
  qualifications: UpsertStaffInput['qualifications'];
  jobSharing: UpsertStaffInput['jobSharing'];
  availableForTeaching: UpsertStaffInput['availableForTeaching'];
  availableForSubstitution: UpsertStaffInput['availableForSubstitution'];
  availableForSupportClasses: UpsertStaffInput['availableForSupportClasses'];
  displayCode: UpsertStaffInput['displayCode'];
  competencies: CatalogueSubjectOption[] | null;
};

type ProfileEmploymentProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
  onSave: CardEditableFormProps<UpsertStaffInput>['onSave'];
};

const getEmploymentDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<('people' | 'common')[]>,
  isCurrentEmployee: boolean,
  setIsCurrentEmployee: Dispatch<SetStateAction<boolean>>
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
      label: t('people:currentEmployee'),
      value: isCurrentEmployee,
      valueRenderer: isCurrentEmployee ? t('common:yes') : t('common:no'),
      valueEditor: (
        <RHFSwitch
          switchProps={{
            color: 'primary',
            onChange: () => setIsCurrentEmployee((prev) => !prev),
          }}
          controlProps={{ name: 'currentEmployee' }}
        />
      ),
    },
    {
      label: t('people:dateOfEmployment'),
      labelForEditingMode: t('common:startDate'),
      valueRenderer: startDate
        ? `${dayjs(startDate).format('l')} - ${
            endDate ? dayjs(endDate).format('l') : t('people:present')
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
    ...(!isCurrentEmployee
      ? [
          {
            label: t('common:endDate'),
            value: endDate ? dayjs(endDate) : null,
            valueRenderer: endDate ? dayjs(endDate).format('l') : '-',
            showOnlyOnEdition: true,
            valueEditor: (
              <RHFDatePicker
                inputProps={{ variant: 'standard' }}
                controlProps={{ name: 'endDate' }}
              />
            ),
          },
        ]
      : []),
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

export const ProfileEmployment = ({
  staffData,
  editable,
  onSave,
}: ProfileEmploymentProps) => {
  const { t } = useTranslation(['common', 'people']);
  const [isCurrentEmployee, setIsCurrentEmployee] = useState(
    staffData?.isCurrentEmployee ?? false
  );

  const employmentDataWithLabels = getEmploymentDataWitLabels(
    staffData,
    t,
    isCurrentEmployee,
    setIsCurrentEmployee
  );

  const { resolver, rules } = useFormValidator<EmploymentFormState>();

  const employmentResolver = resolver({
    startDate: rules.date(),
    employmentCapacity: rules.required(),
  });

  const handleEdit = (
    {
      employmentCapacity,
      currentEmployee,
      startDate,
      endDate,
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
        noLongerStaff: !currentEmployee,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate:
          startDate && !currentEmployee ? endDate?.format('YYYY-MM-DD') : null,
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
