import cloneDeep from 'lodash/cloneDeep';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  OnDragEndResponder,
  OnDragStartResponder,
  DraggableLocation,
} from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import {
  useToast,
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from '@tyro/core';
import {
  ListManagerGroup,
  ListManagerState,
  ListManagerStudent,
} from './types';
import {
  clearSameStudentsFromGroup,
  getGroupsWithDuplicates,
  multiDragAwareReorder,
  multiSelectTo,
  toggleSelection,
  toggleSelectionInGroup,
} from './utils';
import {
  useEditedState,
  UseEditedStateProps,
  EditedStudent,
} from './edited-state';

export interface UseListManagerStateProps {
  listKey: string;
  unassignedStudents: ListManagerStudent[];
  groups: ListManagerGroup[];
  onBulkSave: UseEditedStateProps['onBulkSave'];
}

export function useListManagerState({
  listKey,
  unassignedStudents,
  groups,
  onBulkSave,
}: UseListManagerStateProps) {
  const { t } = useTranslation(['classListManager']);
  const { toast } = useToast();

  const lastEditedGroups = useRef<
    UseEditedStateProps['lastEditedGroups']['current']
  >({
    sourceIds: null,
    destinationId: null,
  });
  const [state, setState] = useState<ListManagerState[]>([]);
  const [draggingStudentId, setDraggingStudentId] = useState<string>();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Array<string>>(
    []
  );

  const resetBoard = () => {
    const mappedGroups =
      groups?.map((group) => ({
        ...group,
        id: group.partyId,
      })) ?? [];

    setState([
      {
        id: 'unassigned',
        name: t('classListManager:unassignedStudents'),
        students: unassignedStudents,
      },
      ...mappedGroups,
    ]);
  };

  const editedState = useEditedState({
    listKey,
    lastEditedGroups,
    state,
    onBulkSave,
    resetBoard,
  });

  const unselectAll = () => {
    setSelectedStudentIds([]);
  };

  const clearStudentsWithSamePartyId = useCallback(
    (groupsToCheck: ListManagerState[], groupId: string) => {
      const onDuplicateCleared = () => {
        toast(t('classListManager:weveTidiedStudentsInGroup'), {
          variant: 'info',
        });
      };
      return clearSameStudentsFromGroup(
        groupsToCheck,
        groupId,
        onDuplicateCleared
      );
    },
    [t, toast]
  );

  const moveStudents = (
    studentIds: string[],
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    setState((prevState) => {
      const { newGroups, sourceGroupIds } = multiDragAwareReorder({
        groups: prevState,
        selectedStudentIds: studentIds,
        source,
        destination,
      });

      lastEditedGroups.current = {
        destinationId: destination.droppableId,
        sourceIds: sourceGroupIds,
      };

      return clearStudentsWithSamePartyId(newGroups, destination.droppableId);
    });
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

    // dropped on a list
    if (destination && result.reason !== 'CANCEL') {
      moveStudents(selectedStudentIds, source, destination);
    }

    setDraggingStudentId(undefined);
  };

  const duplicateStudents = (groupIdToMoveTo: number, studentIds: string[]) => {
    lastEditedGroups.current = {
      destinationId: String(groupIdToMoveTo),
      sourceIds: null,
    };
    setState((prevState) => {
      const updatedGroups = getGroupsWithDuplicates(
        groupIdToMoveTo,
        studentIds,
        prevState
      );

      return clearStudentsWithSamePartyId(
        updatedGroups,
        String(groupIdToMoveTo)
      );
    });
  };

  const deleteDuplicate = (groupId: number | string, studentId: string) => {
    lastEditedGroups.current = {
      destinationId: null,
      sourceIds: [String(groupId)],
    };
    setState((prevState) => {
      const newState = cloneDeep(prevState);
      const groupIndex = newState.findIndex(
        (group) => String(group.id) === String(groupId)
      );
      const studentIndex = newState[groupIndex].students.findIndex(
        (student) => student.id === studentId
      );
      newState[groupIndex].students.splice(studentIndex, 1);
      return newState;
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

  const revertChange = ({
    student,
    sourceGroup,
    destinationGroup,
  }: EditedStudent) => {
    if (sourceGroup && destinationGroup) {
      const destinationGroupIndexFromState = state.findIndex(
        (group) => group.id === destinationGroup.id
      );
      const currentStudentIndex = state[
        destinationGroupIndexFromState
      ].students.findIndex(({ id }) => id === student.id);
      moveStudents(
        [String(student.id)],
        {
          droppableId: String(destinationGroup.id),
          index: currentStudentIndex,
        },
        {
          droppableId: String(sourceGroup.id),
          index: 0,
        }
      );
    } else if (destinationGroup) {
      deleteDuplicate(destinationGroup.id, student.id);
    } else if (sourceGroup && sourceGroup.id !== 'unassigned') {
      duplicateStudents(sourceGroup.id, [String(student.person.partyId)]);
    }
  };

  useEffect(() => {
    resetBoard();
  }, [listKey]);

  useEffect(() => {
    const onWindowClickOrTouchEnd = (event: MouseEvent | TouchEvent) => {
      if (event.defaultPrevented) return;
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
    editedState: {
      ...editedState,
      revertChange,
    },
    cardProps: {
      draggingStudentId,
      performCardAction,
      selectedStudentIds,
      deleteDuplicate,
      contextMenuProps: {
        selectedStudentIds,
        state,
        duplicateStudents,
        moveStudents,
      },
    },
  };
}

export type ReturnTypeOfUseListManagerState = ReturnType<
  typeof useListManagerState
>;
