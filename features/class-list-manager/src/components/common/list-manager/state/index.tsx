import cloneDeep from 'lodash/cloneDeep';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  DragStart,
  DropResult,
  OnDragEndResponder,
  OnDragStartResponder,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { ReturnTypeOfUseBlockMembership } from '../../../../api/blocks';
import { ListManagerState } from './types';
import {
  clearSameStudentsFromGroup,
  getGroupsWithDuplicates,
  multiDragAwareReorder,
  multiSelectTo,
  toggleSelection,
  toggleSelectionInGroup,
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from './utils';
import {
  useEditedState,
  UseEditedStateProps,
  EditedStudent,
} from './edited-state';

export interface UseListManagerStateProps {
  unassignedStudents: ReturnTypeOfUseBlockMembership['groups'][number]['unenrolledStudents'];
  groups: ReturnTypeOfUseBlockMembership['groups'][number]['subjectGroups'];
  onBulkSave: UseEditedStateProps['onBulkSave'];
}

export function useListManagerState({
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
      setState((prevState) => {
        const { newGroups, sourceGroupIds } = multiDragAwareReorder({
          groups: prevState,
          selectedStudentIds,
          source,
          destination,
        });

        lastEditedGroups.current = {
          destinationId: destination.droppableId,
          sourceIds: sourceGroupIds,
        };

        return clearStudentsWithSamePartyId(newGroups, destination.droppableId);
      });
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
      onDragStart(
        {
          draggableId: student.id,
        } as DragStart,
        {} as ResponderProvided
      );
      const destinationGroupIndexFromState = state.findIndex(
        (group) => group.id === destinationGroup.id
      );
      const currentStudentIndex = state[
        destinationGroupIndexFromState
      ].students.findIndex(({ id }) => id === student.id);
      onDragEnd(
        {
          source: {
            droppableId: String(destinationGroup.id),
            index: currentStudentIndex,
          },
          destination: {
            droppableId: String(sourceGroup.id),
            index: 0,
          },
        } as DropResult,
        {} as ResponderProvided
      );
    } else if (destinationGroup) {
      deleteDuplicate(destinationGroup.id, student.id);
    } else if (sourceGroup && sourceGroup.id !== 'unassigned') {
      duplicateStudents(sourceGroup.id, [String(student.person.partyId)]);
    }
  };

  useEffect(() => {
    resetBoard();
  }, [t, unassignedStudents, groups]);

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
        groups,
        duplicateStudents,
      },
    },
  };
}

export type ReturnTypeOfUseListManagerState = ReturnType<
  typeof useListManagerState
>;
