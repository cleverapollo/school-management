import { Control, useController, useWatch } from 'react-hook-form';
import { SelectionList, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useYearGroupListsByFilter } from '@tyro/groups';
import { useMemo } from 'react';
import { SubjectOptionsFormState } from './types';

interface StudentSelectionProps {
  control: Control<SubjectOptionsFormState>;
}

export function StudentSelection({ control }: StudentSelectionProps) {
  const { displayName } = usePreferredNameLayout();
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
  } = useController({
    name: 'selectedStudents',
    control,
    defaultValue: [],
  });

  const { data } = useYearGroupListsByFilter(
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

  if (!dependenciesSet) {
    // Add empty state
    return null;
  }

  return (
    <SelectionList
      value={value}
      onChange={(values) => {
        console.log(values);
        onChange(values);
      }}
      showSearch
      options={options}
      optionIdKey="partyId"
      getOptionLabel={(option) => displayName(option.person)}
      collapsibleGroups
      groupBy={(option) =>
        option?.classGroup?.name ?? t('subjectOptions:noClassGroup')
      }
    />
  );
}
