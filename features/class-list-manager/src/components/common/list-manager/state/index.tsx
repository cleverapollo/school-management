import { useEffect, useState } from 'react';
import { OnDragEndResponder, OnDragStartResponder } from 'react-beautiful-dnd';
import { ReturnTypeOfUseBlockMembership } from '../../../../api/blocks';
import { ListManagerState } from './types';
import {
  getGroupsWithDuplicates,
  multiDragAwareReorder,
  multiSelectTo,
  toggleSelection,
  toggleSelectionInGroup,
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from './utils';

export interface UseListManagerStateProps {
  unassignedStudents: ReturnTypeOfUseBlockMembership['groups'][number]['unenrolledStudents'];
  groups: ReturnTypeOfUseBlockMembership['groups'][number]['subjectGroups'];
}

export function useListManagerState({
  unassignedStudents,
  groups,
}: UseListManagerStateProps) {
  const [state, setState] = useState<ListManagerState[]>([]);
  const [draggingStudentId, setDraggingStudentId] = useState<string>();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Array<string>>(
    []
  );

  console.log({
    selectedStudentIds,
    draggingStudentId,
  });

  const unselectAll = () => {
    setSelectedStudentIds([]);
  };

  const onDragStart: OnDragStartResponder = (result) => {
    const id = result.draggableId;
    const selected = selectedStudentIds.includes(id);

    if (!selected) {
      unselectAll();
    }

    setDraggingStudentId(id);
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (destination && result.reason !== 'CANCEL') {
      const newState = multiDragAwareReorder({
        groups: state,
        selectedStudentIds,
        source,
        destination,
      });
      setState(newState);
    }

    setDraggingStudentId(undefined);
  };

  const duplicateStudents = (groupIdToMoveTo: number, studentIds: string[]) => {
    setState((prevState) => {
      const duplicateState = getGroupsWithDuplicates(
        groupIdToMoveTo,
        studentIds,
        prevState
      );
      console.log({
        duplicateState,
      });
      return duplicateState;
    });
  };

  const performCardAction = (
    event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    studentId: string
  ) => {
    setSelectedStudentIds((selectedIds) => {
      if (wasToggleInSelectionGroupKeyUsed(event)) {
        return toggleSelectionInGroup(studentId, selectedIds);
      }

      if (wasMultiSelectKeyUsed(event)) {
        return multiSelectTo(studentId, selectedIds, state);
      }

      return toggleSelection(studentId, selectedIds);
    });
  };

  useEffect(() => {
    const mappedGroups =
      groups?.map((group) => ({
        ...group,
        id: group.partyId,
      })) ?? [];

    setState([
      {
        id: 'unassigned',
        name: 'Unassigned Students',
        students: unassignedStudents,
      },
      ...mappedGroups,
    ]);
  }, [unassignedStudents, groups]);

  useEffect(() => {
    const onWindowClickOrTouchEnd = (event: MouseEvent | TouchEvent) => {
      if (event.defaultPrevented) return;
      console.log('onWindowClickOrTouchEnd', event);
      unselectAll();
    };

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (event.key === 'Escape') {
        unselectAll();
      }
    };

    window.addEventListener('click', onWindowClickOrTouchEnd);
    window.addEventListener('touchend', onWindowClickOrTouchEnd);
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('click', onWindowClickOrTouchEnd);
      window.removeEventListener('touchend', onWindowClickOrTouchEnd);
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, []);

  return {
    state,
    onDragEnd,
    onDragStart,
    cardProps: {
      draggingStudentId,
      performCardAction,
      selectedStudentIds,
      contextMenuProps: {
        selectedStudentIds,
        groups,
        duplicateStudents,
      },
    },
  };
}

export type ReturnTypeOfUseListManagerState = ReturnType<
  typeof useListManagerState
>;
