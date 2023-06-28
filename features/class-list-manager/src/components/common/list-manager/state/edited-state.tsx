import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ListManagerState } from './types';

type EditStudentGroup = Pick<ListManagerState, 'id' | 'name'>;
export interface EditedStudent {
  sourceGroup: EditStudentGroup | null;
  destinationGroup: EditStudentGroup | null;
  student: ListManagerState['students'][number];
}

export interface UseEditedStateProps {
  listKey: string;
  lastEditedGroups: MutableRefObject<{
    sourceIds: string[] | null;
    destinationId: string | null;
  }>;
  state: ListManagerState[];
  onBulkSave: ((data: EditedStudent[]) => Promise<unknown>) | undefined;
  resetBoard: (state?: ListManagerState[]) => void;
}

export enum EditState {
  Idle = 'IDLE',
  Saving = 'SAVING',
  Saved = 'SAVED',
  Error = 'ERROR',
}

function getChangesSinceLastChange(
  lastEditedGroups: UseEditedStateProps['lastEditedGroups'],
  previousState: ListManagerState[],
  newState: ListManagerState[]
) {
  const { current: lastEdited } = lastEditedGroups;
  const { sourceIds, destinationId } = lastEdited;
  const changedStudents = new Map<string, EditedStudent>();

  const previousSourceGroups = sourceIds?.map((id) =>
    previousState.find((group) => String(group.id) === id)
  );
  const newSourceGroups = sourceIds?.map((id) =>
    newState.find((group) => String(group.id) === id)
  );

  // Add students that are missing from source groups
  newSourceGroups?.forEach((newGroup) => {
    const studentIdsInNew =
      newGroup?.students.map((student) => student.id) ?? [];
    const previousGroup = previousSourceGroups?.find(
      (group) => group?.id === newGroup?.id
    );

    previousGroup?.students.forEach((student) => {
      if (!studentIdsInNew.includes(student.id)) {
        changedStudents.set(student.id, {
          sourceGroup: newGroup
            ? {
                id: newGroup.id,
                name: newGroup.name,
              }
            : null,
          destinationGroup: null,
          student,
        });
      }
    });
  });

  const previousDestinationGroup = previousState.find(
    (group) => String(group.id) === destinationId
  );
  const newDestinationGroup = newState.find(
    (group) => String(group.id) === destinationId
  );

  // Add students that are missing from destination group and merge them into  students in changedStudents
  const studentIdsInPreviousDestination =
    previousDestinationGroup?.students.map((student) => student.id) ?? [];

  newDestinationGroup?.students.forEach((student) => {
    if (!studentIdsInPreviousDestination.includes(student.id)) {
      const existingStudent = changedStudents.get(student.id) ?? {
        sourceGroup: null,
      };

      changedStudents.set(student.id, {
        ...existingStudent,
        destinationGroup: newDestinationGroup
          ? {
              id: newDestinationGroup.id,
              name: newDestinationGroup.name,
            }
          : null,
        student,
      });
    }
  });

  return Array.from(changedStudents.values());
}

export function useEditedState({
  listKey,
  lastEditedGroups,
  state,
  onBulkSave,
  resetBoard,
}: UseEditedStateProps) {
  const previousListKey = useRef<string>();
  const originalState = useRef<ListManagerState[]>([]);
  const previousState = useRef<ListManagerState[]>([]);
  const changeHistory = useRef<EditedStudent[][]>([]);
  const [editingState, setEditingState] = useState<EditState>(EditState.Idle);
  const [editedStudents, setEditedStudents] = useState<EditedStudent[]>([]);

  const onSave = async () => {
    if (onBulkSave) {
      try {
        setEditingState(EditState.Saving);
        await onBulkSave(editedStudents);
        setEditingState(EditState.Saved);
        setEditedStudents([]);
      } catch (e) {
        setEditingState(EditState.Error);
        console.error(e);
      } finally {
        setTimeout(() => {
          setEditingState(EditState.Idle);
        }, 2000);
      }
    }
  };

  const onCancel = () => {
    resetBoard();
    changeHistory.current = [];
    setEditingState(EditState.Idle);
    setEditedStudents([]);
    if (originalState.current.length > 0) {
      previousState.current = originalState.current;
    }
  };

  useEffect(() => {
    if (state.length <= 0) return;

    if (previousListKey.current !== listKey) {
      changeHistory.current = [];
      setEditingState(EditState.Idle);
      setEditedStudents([]);
      originalState.current = state;
    } else {
      const changedStudents = getChangesSinceLastChange(
        lastEditedGroups,
        previousState.current,
        state
      );

      changeHistory.current.unshift(changedStudents);
      if (changeHistory.current.length > 20) {
        changeHistory.current.pop();
      }

      setEditedStudents((previousEditedState) => {
        const newEditedState = [...previousEditedState];
        changedStudents.forEach((changedStudent) => {
          const changedStudentIndex = newEditedState.findIndex(
            (student) => student.student.id === changedStudent.student.id
          );

          if (changedStudentIndex === -1) {
            newEditedState.push(changedStudent);
          } else {
            const existingStudent = newEditedState[changedStudentIndex];

            if (
              existingStudent.sourceGroup?.id ===
              changedStudent.destinationGroup?.id
            ) {
              newEditedState.splice(changedStudentIndex, 1);
            } else {
              newEditedState[changedStudentIndex] = {
                ...existingStudent,
                destinationGroup: changedStudent.destinationGroup,
              };
            }
          }
        });

        return newEditedState;
      });
    }

    previousListKey.current = listKey;
    previousState.current = state;
  }, [state]);

  return {
    isEditing: editedStudents.length > 0 || editingState !== EditState.Idle,
    editingState,
    editedStudents,
    numberOfEdits: editedStudents.length,
    onSave,
    onCancel,
  };
}

export type ReturnTypeOfUseEditedState = ReturnType<typeof useEditedState>;
