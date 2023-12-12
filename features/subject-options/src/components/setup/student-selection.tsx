import { useClassGroups } from '@tyro/groups';
import { Control, useWatch } from 'react-hook-form';
import { DragDropContext } from 'react-beautiful-dnd';

interface StudentSelectionProps {
  control: Control<{
    academicYearId: number;
    yearGroupEnrolmentPartyId: number;
  }>;
}

export function StudentSelection(props: StudentSelectionProps) {
  const [academicYearId, yearGroupEnrolmentPartyId] = useWatch({
    name: ['academicYearId', 'yearGroupEnrolmentPartyId'],
    control: props.control,
  });

  const { data } = useClassGroups();

  if (!academicYearId || !yearGroupEnrolmentPartyId) {
    // Add empty state
    return null;
  }

  return <DragDropContext />;
}
