import { useClassGroups } from '@tyro/groups';
import { Control, useWatch } from 'react-hook-form';
import { SelectionList, usePreferredNameLayout } from '@tyro/core';
import {
  DragDropContext,
  OnDragEndResponder,
  OnDragStartResponder,
} from 'react-beautiful-dnd';
import { useStudents } from '@tyro/people';
import { useTranslation } from '@tyro/i18n';

interface StudentSelectionProps {
  control: Control<{
    academicYearId?: number;
    yearGroupEnrolmentPartyId?: number;
  }>;
}

export function StudentSelection({ control }: StudentSelectionProps) {
  const { displayName } = usePreferredNameLayout();
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [academicYearId, yearGroupEnrolmentPartyId] = useWatch({
    name: ['academicYearId', 'yearGroupEnrolmentPartyId'],
    control,
  });

  const { data } = useStudents();

  if (!academicYearId || !yearGroupEnrolmentPartyId) {
    // Add empty state
    return null;
  }

  return (
    <SelectionList
      value={[]}
      options={data ?? []}
      optionIdKey="partyId"
      getOptionLabel={(option) => displayName(option.person)}
      groupBy={(option) =>
        option?.classGroup?.name ?? t('subjectOptions:noClassGroup')
      }
    />
  );
}
