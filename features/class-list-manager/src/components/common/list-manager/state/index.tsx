import cloneDeep from 'lodash/cloneDeep';
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  OnDragEndResponder,
  OnDragStartResponder,
  DraggableLocation,
} from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import {
  usePreferredNameLayout,
  useToast,
  wasMultiSelectKeyUsed,
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
  toggleSelectionInGroup,
} from './utils';
import {
  useEditedState,
  UseEditedStateProps,
  EditedStudent,
  ReturnTypeOfUseEditedState,
} from './edited-state';

export interface UseListManagerStateProps {
  listKey: string;
  unassignedStudents: ListManagerStudent[];
  groups: ListManagerGroup[];
  onBulkSave: UseEditedStateProps['onBulkSave'];
}

export type ListManagerContextValue = {
  state: ListManagerState[];
  onDragEnd: OnDragEndResponder;
  onDragStart: OnDragStartResponder;
  editedState: ReturnTypeOfUseEditedState & {
    revertChange: (student: EditedStudent) => void;
  };
  draggingStudentId: string | undefined;
  performCardAction: (
    event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    studentId: string
  ) => void;
  selectedStudentIds: string[];
  deleteDuplicate: (groupId: number | string, studentId: string) => void;
  duplicateStudents: (groupIdToMoveTo: number, studentIds: string[]) => void;
  moveStudents: (
    studentIds: string[],
    source: DraggableLocation,
    destination: DraggableLocation
  ) => void;
  enableDuplicateStudents: boolean;
  includeClassGroupName: boolean;
  unassignedSearch: string;
  setUnassignedSearch: Dispatch<SetStateAction<string>>;
};

const ListManagerContext = createContext<ListManagerContextValue | undefined>(
  undefined
);

type ListManagerProviderProps = {
  children: ReactNode;
  listKey: string;
  unassignedStudents: ListManagerStudent[];
  groups: ListManagerGroup[];
  onBulkSave: UseEditedStateProps['onBulkSave'];
  enableDuplicateStudents: boolean;
  includeClassGroupName: boolean;
};

export function ListManagerProvider({
  listKey,
  unassignedStudents,
  groups,
  onBulkSave,
  children,
  enableDuplicateStudents,
  includeClassGroupName,
}: ListManagerProviderProps) {
  const { t } = useTranslation(['classListManager']);
  const { toast } = useToast();
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const { displayName } = usePreferredNameLayout();

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
      if (wasMultiSelectKeyUsed(event)) {
        return multiSelectTo(
          studentId,
          selectedIds,
          state,
          unassignedSearch,
          displayName,
          includeClassGroupName
        );
      }

      return toggleSelectionInGroup(studentId, selectedIds);
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

  const providerValue = useMemo(
    () => ({
      state,
      onDragEnd,
      onDragStart,
      editedState: {
        ...editedState,
        revertChange,
      },
      draggingStudentId,
      performCardAction,
      selectedStudentIds,
      deleteDuplicate,
      duplicateStudents,
      moveStudents,
      enableDuplicateStudents,
      includeClassGroupName,
      unassignedSearch,
      setUnassignedSearch,
    }),
    [
      state,
      onDragEnd,
      onDragStart,
      editedState,
      revertChange,
      draggingStudentId,
      performCardAction,
      selectedStudentIds,
      deleteDuplicate,
      duplicateStudents,
      moveStudents,
      enableDuplicateStudents,
      includeClassGroupName,
      unassignedSearch,
      setUnassignedSearch,
    ]
  );

  return (
    <ListManagerContext.Provider value={providerValue}>
      {children}
    </ListManagerContext.Provider>
  );
}

export function useListManagerState() {
  const context = useContext(ListManagerContext);
  if (context === undefined) {
    throw new Error(
      'useListManagerState must be used within a ListManagerContext'
    );
  }
  return context;
}
