import { Chip, Stack } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  RHFSelect,
  RHFDatePicker,
  RHFSwitch,
  useFormValidator,
} from '@tyro/core';
import dayjs from 'dayjs';

import {
  UpsertStaffInput,
  getColorBasedOnIndex,
  // EmploymentCapacity,
  Staff,
  // CreateStaffTeacherIre,
} from '@tyro/api';
import { EmploymentCapacityAutocomplete } from '../../../../components/common/employment-capacity-autocomplete';
import { useStaffPersonal } from '../../../../api/staff/personal';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '../../../../components/common/card-editable-form';

type EmploymentFormState = {
  // post: CreateStaffTeacherIre['teachingPost'];
  employmentCapacity: Staff['employmentCapacity'];
  payrollNumber: UpsertStaffInput['payrollNumber'];
  displayCode: UpsertStaffInput['displayCode'];
  // teacherCouncilNumber: CreateStaffTeacherIre['teacherCouncilNumber'];
  startDate: UpsertStaffInput['startDate'];
  subjectGroups: Staff['subjectGroups'];
  jobSharing: boolean;
  qualifications: string;
};

// const employmentCapacityOptions = Object.values(EmploymentCapacity);

const getEmploymentDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<('people' | 'common')[]>
): CardEditableFormProps<EmploymentFormState>['fields'] => {
  const {
    payrollNumber,
    employmentCapacity,
    // staffIreTeacher,
    startDate,
    endDate,
    subjectGroups = [],
    displayCode,
  } = data || {};

  const competencies = Array.from(
    new Map(
      subjectGroups
        .flatMap(({ subjects }) => subjects)
        .map((subject) => [subject.name, subject])
    ).values()
  );

  return [
    // {
    //   label: t('people:post'),
    //   value: staffIreTeacher?.teachingPost,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'position' }}
    //     />
    //   ),
    // },
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
      label: t('people:displayCode'),
      value: displayCode,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'displayCode' }}
        />
      ),
    },
    // {
    //   label: t('people:teacherCouncilNumber'),
    //   value: staffIreTeacher?.teacherCouncilNumber,
    //   valueEditor: (
    //     <RHFTextField
    //       textFieldProps={{ variant: 'standard' }}
    //       controlProps={{ name: 'teacherCouncilNumber' }}
    //     />
    //   ),
    // },
    {
      // NOTE: at this stage, this value doesn't come from BE
      label: t('people:jobSharing'),
      value: null,
      valueEditor: (
        <RHFSwitch
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'jobSharing' }}
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
      value: startDate ? dayjs(startDate) : undefined,
      valueEditor: (
        <RHFDatePicker
          inputProps={{ variant: 'standard' }}
          controlProps={{ name: 'startDate' }}
        />
      ),
    },
    {
      // NOTE: at this stage, this value doesn't come from BE
      label: t('people:qualifications'),
      value: null,
      valueEditor: (
        <RHFTextField
          textFieldProps={{ variant: 'standard' }}
          controlProps={{ name: 'teacherCouncilNumber' }}
        />
      ),
    },
    // {
    //   label: t('people:competencies'),
    //   valueRenderer:
    //     competencies.length > 0 ? (
    //       <Stack flexDirection="row" flexWrap="wrap" gap={0.5}>
    //         {competencies.map(({ name, colour }, index) => (
    //           <Chip
    //             key={name}
    //             color={colour ?? getColorBasedOnIndex(index)}
    //             label={name}
    //           />
    //         ))}
    //       </Stack>
    //     ) : (
    //       '-'
    //     ),
    //   value: subjectGroups,
    // },
  ];
};

type ProfileEmploymentProps = {
  staffData: ReturnType<typeof useStaffPersonal>['data'];
  editable?: boolean;
};

export const ProfileEmployment = ({
  staffData,
  editable,
}: ProfileEmploymentProps) => {
  const { t } = useTranslation(['common', 'people']);

  const employmentDataWithLabels = getEmploymentDataWitLabels(staffData, t);

  const { resolver, rules } = useFormValidator<EmploymentFormState>();

  const employmentResolver = resolver({
    startDate: rules.date(),
  });

  const handleEdit = async (data: EmploymentFormState) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 300);
    });

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
