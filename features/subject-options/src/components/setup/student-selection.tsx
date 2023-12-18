import { useClassGroups } from '@tyro/groups';
import { Control, useWatch } from 'react-hook-form';
import { DragDropContext, OnDragEndResponder, OnDragStartResponder } from 'react-beautiful-dnd';

interface StudentSelectionProps {
  control: Control<{
    academicYearId: number;
    yearGroupEnrolmentPartyId: number;
  }>;
}

export function StudentSelection({ control }: StudentSelectionProps) {
  const [academicYearId, yearGroupEnrolmentPartyId] = useWatch({
    name: ['academicYearId', 'yearGroupEnrolmentPartyId'],
    control,
  });
  

  const { data } = useClassGroups();

  if (!academicYearId || !yearGroupEnrolmentPartyId) {
    // Add empty state
    return null;
  }

  return (
    <DragDropContext onDragStart={()} onDragEnd={}>
      
    </DragDropContext>
  );
}
