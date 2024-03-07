import { Control, useController } from 'react-hook-form';
import { SelectionList, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo, useRef, useEffect, useState } from 'react';
import { FormHelperText, Stack } from '@mui/material';
import { SubjectOptionsFormState } from './types';
import { YearGroupEnrolment } from './year-group-enrolment';
import { OptionsYearAutocomplete } from './options-year-autocomplete';
import {
  ReturnTypeFromUseOptionsAvailableEnrollmentGroups,
  useOptionsEnrollmentGroupsStudents,
} from '../../api/options-enrolment-groups';

interface StudentSelectionProps {
  control: Control<SubjectOptionsFormState>;
}

export function StudentSelection({ control }: StudentSelectionProps) {
  const { displayName } = usePreferredNameLayout();
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [selectedYearGroups, setSelectedYearGroups] = useState<
    ReturnTypeFromUseOptionsAvailableEnrollmentGroups[]
  >([]);
  const dependenciesSet = Boolean(selectedYearGroups.length > 0);

  const {
    field: { value, onChange },
    formState: { errors },
  } = useController({
    name: 'selectedStudents',
    control,
    defaultValue: [],
  });

  const { data: students, isLoading } = useOptionsEnrollmentGroupsStudents(
    {
      groupIds: selectedYearGroups.map((group) => group.id),
    },
    dependenciesSet
  );

  const options = useMemo(() => {
    if (!students) return [];

    return students.sort((a, b) => {
      if (a.classGroup?.name !== b.classGroup?.name) {
        return (
          (a.classGroup?.name ?? '').localeCompare(b.classGroup?.name ?? '') ||
          0
        );
      }

      const aName = displayName(a.person);
      const bName = displayName(b.person);
      return aName.localeCompare(bName);
    });
  }, [students]);

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
            <OptionsYearAutocomplete
              value={selectedYearGroups}
              onChange={(_, newYearGroups) => {
                let checkedValue: ReturnTypeFromUseOptionsAvailableEnrollmentGroups[] =
                  [];
                if (newYearGroups) {
                  checkedValue = Array.isArray(newYearGroups)
                    ? newYearGroups
                    : [newYearGroups];
                }
                setSelectedYearGroups(checkedValue);
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
