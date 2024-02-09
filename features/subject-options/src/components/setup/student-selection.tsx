import { Control, useController, useWatch } from 'react-hook-form';
import { SelectionList, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  RHFYearGroupAutocomplete,
  useYearGroupListsByFilter,
} from '@tyro/groups';
import { useMemo, useRef, useEffect } from 'react';
import { FormHelperText, Stack } from '@mui/material';
import { SubjectOptionsFormState } from './types';
import { AcademicYearSelect } from './academic-year-select';
import { YearGroupEnrolment } from './year-group-enrolment';

interface StudentSelectionProps {
  control: Control<SubjectOptionsFormState>;
}

export function StudentSelection({ control }: StudentSelectionProps) {
  const { displayName } = usePreferredNameLayout();
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [academicYearId, selectedStudentYearGroups] = useWatch({
    name: ['academicYearId', 'selectedStudentYearGroups'],
    control,
  });
  const dependenciesSet = Boolean(
    academicYearId && selectedStudentYearGroups?.length > 0
  );

  const {
    field: { value, onChange },
    formState: { errors },
  } = useController({
    name: 'selectedStudents',
    control,
    defaultValue: [],
  });

  const { data, isLoading } = useYearGroupListsByFilter(
    {
      academicNamespaceIds: [academicYearId],
      yearGroupEnrollmentPartyId: selectedStudentYearGroups?.map(
        ({ partyId }) => partyId
      ),
    },
    dependenciesSet
  );

  const options = useMemo(() => {
    if (!data) return [];

    return data
      .flatMap((yearGroup) => yearGroup.students)
      .sort((a, b) => {
        if (a.classGroup?.name !== b.classGroup?.name) {
          return (
            (a.classGroup?.name ?? '').localeCompare(
              b.classGroup?.name ?? ''
            ) || 0
          );
        }

        const aName = displayName(a.person);
        const bName = displayName(b.person);
        return aName.localeCompare(bName);
      });
  }, [data]);

  useEffect(() => {
    if (errors.selectedStudents && !errors.name && containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  }, [errors]);

  return (
    <Stack
      ref={containerRef}
      sx={{
        '& > .MuiPaper-root': {
          borderColor: errors.selectedStudents ? 'error.main' : undefined,
        },
      }}
    >
      <SelectionList
        value={value}
        isLoading={dependenciesSet && isLoading}
        onChange={onChange}
        showSearch
        options={options}
        optionIdKey="partyId"
        getOptionLabel={(option) => displayName(option.person)}
        collapsibleGroups
        groupBy={(option) =>
          option?.classGroup?.name ?? t('subjectOptions:noClassGroup')
        }
        firstColumnHeader={
          <Stack direction="row" spacing={1}>
            <AcademicYearSelect
              variant="white-filled"
              controlProps={{
                name: 'academicYearId',
                control,
              }}
              sx={{
                maxWidth: 300,
                '& .MuiInputBase-root': {
                  border: '1px solid',
                  borderColor: 'indigo.50',
                },
              }}
            />
            <RHFYearGroupAutocomplete
              label={t('common:years')}
              controlProps={{
                name: 'selectedStudentYearGroups',
                control,
              }}
              limitTags={1}
              academicNamespaceId={academicYearId}
              multiple
              inputProps={{
                variant: 'white-filled',
              }}
              sx={{
                maxWidth: 320,
                '& .MuiInputBase-root': {
                  border: '1px solid',
                  borderColor: 'indigo.50',
                },
              }}
              ChipProps={{
                size: 'small',
                variant: 'soft',
                color: 'primary',
              }}
            />
          </Stack>
        }
        secondColumnHeader={<YearGroupEnrolment control={control} />}
        firstColumnLabel={t('subjectOptions:selectStudents')}
        firstColumnEmptyMessage={t(
          'subjectOptions:selectYearsToChooseStudentsFrom'
        )}
        secondColumnEmptyMessage={t('subjectOptions:noStudentsSelected')}
        selectedCountLabel={(count) => t('subjectOptions:xStudents', { count })}
      />
      {errors.selectedStudents && (
        <FormHelperText error>{errors.selectedStudents.message}</FormHelperText>
      )}
    </Stack>
  );
}
