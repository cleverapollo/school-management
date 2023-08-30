import { DraggableLocation } from 'react-beautiful-dnd';
import cloneDeep from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import { ReturnTypeDisplayName } from '@tyro/core';
import { ListManagerState } from './types';

interface DragArguments {
  groups: ListManagerState[];
  selectedStudentIds: string[];
  source: DraggableLocation;
  destination: DraggableLocation;
}

/**
 * Reorder an item in a single list
 */
function reorder(list: ListManagerState, startIndex: number, endIndex: number) {
  const result = Array.from(list?.students ?? []);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return {
    ...list,
    students: result,
  };
}

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: ListManagerState,
  destination: ListManagerState,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceStudentsClone = Array.from(source?.students ?? []);
  const destStudentsClone = Array.from(destination?.students ?? []);
  const [removed] = sourceStudentsClone.splice(droppableSource.index, 1);

  destStudentsClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: {
      ...source,
      students: sourceStudentsClone,
    },
    [droppableDestination.droppableId]: {
      ...destination,
      students: destStudentsClone,
    },
  };
};

export const clearSameStudentsFromGroup = (
  groups: ListManagerState[],
  groupId: string,
  onDuplicateCleared: () => void
) => {
  const matchedGroupIndex = groups.findIndex(
    (group) => String(group.id) === groupId
  );
  const matchedGroup = groups[matchedGroupIndex];

  if (!matchedGroup) return groups;

  // Group students by matching partyId
  const groupedStudents = matchedGroup.students.reduce(
    (acc, student, index) => {
      const key = student.person.partyId;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push({
        index,
        student,
      });

      return acc;
    },
    {} as Record<
      string,
      { index: number; student: ListManagerState['students'][number] }[]
    >
  );

  // Gather the duplicate indexes to remove, ones that are not duplicates will be kept
  const indexesToRemove: number[] = [];
  Object.values(groupedStudents).forEach((group) => {
    if (group.length > 1) {
      const isOneNotADuplicate = group.some(
        ({ student }) => !student.isDuplicate
      );

      if (isOneNotADuplicate) {
        group.forEach(({ index, student }) => {
          if (student.isDuplicate) {
            indexesToRemove.push(index);
          }
        });
      } else {
        const [first, ...rest] = group;
        rest.forEach(({ index }) => {
          indexesToRemove.push(index);
        });
      }
    }
  });

  if (indexesToRemove.length > 0) {
    onDuplicateCleared();

    // Remove the duplicates
    groups[matchedGroupIndex].students = matchedGroup.students.filter(
      (_, index) => !indexesToRemove.includes(index)
    );
  }

  return groups;
};

const singleDrag = ({ groups, source, destination }: DragArguments) => {
  const sourceGroupId = source.droppableId;
  const destinationGroupId = destination.droppableId;
  const sourceGroupIndex = groups.findIndex(
    (group) => String(group.id) === sourceGroupId
  );
  const destinationGroupIndex = groups.findIndex(
    (group) => String(group.id) === destinationGroupId
  );

  // Moving in same list
  if (sourceGroupIndex === destinationGroupIndex) {
    // Reorder in list
    const items = reorder(
      groups[sourceGroupIndex],
      source.index,
      destination.index
    );
    const newGroups = [...groups];
    newGroups[sourceGroupIndex] = items;
    return {
      sourceGroupIds: [sourceGroupId],
      newGroups,
    };
  }

  // Move to new list
  const moveResult = move(
    groups[sourceGroupIndex],
    groups[destinationGroupIndex],
    source,
    destination
  );

  const newGroups = [...groups];
  newGroups[sourceGroupIndex] = moveResult[sourceGroupId];
  newGroups[destinationGroupIndex] = moveResult[destinationGroupId];

  return {
    sourceGroupIds: [sourceGroupId],
    newGroups,
  };
};

const multiDrag = ({
  groups,
  source,
  destination,
  selectedStudentIds,
}: DragArguments) => {
  const destinationGroupId = destination.droppableId;
  const destinationGroupIndex = groups.findIndex(
    (group) => String(group.id) === destinationGroupId
  );

  const sourceGroupId = source.droppableId;
  const sourceGroup = groups.find(
    (group) => String(group.id) === sourceGroupId
  );
  const dragged = sourceGroup?.students[source.index];

  const selectedStudents: ListManagerState['students'] = [];
  const sourceGroupIds = new Set<string>();
  const newGroups = [...groups].reduce((acc, group) => {
    const newGroup = { ...group };

    newGroup.students = group.students.reduce((studentAcc, student) => {
      if (selectedStudentIds.includes(student.id)) {
        selectedStudents.push(student);
        sourceGroupIds.add(String(group.id));
        return studentAcc;
      }
      studentAcc.push(student);
      return studentAcc;
    }, [] as ListManagerState['students']);

    acc.push(newGroup);
    return acc;
  }, [] as ListManagerState[]);

  selectedStudents.sort((a, b) => {
    if (a.id === dragged?.id) {
      return -1;
    }
    if (b.id === dragged?.id) {
      return 1;
    }
    return 0;
  });

  newGroups[destinationGroupIndex].students.splice(
    destination.index,
    0,
    ...selectedStudents
  );

  return {
    sourceGroupIds: Array.from(sourceGroupIds),
    newGroups,
  };
};

export const multiDragAwareReorder = (args: DragArguments) => {
  if (args.selectedStudentIds.length > 1) {
    return multiDrag(args);
  }
  return singleDrag(args);
};

export const toggleSelectionInGroup = (
  studentId: string,
  selectedStudentIds: string[]
) => {
  const selectedStudentIdsClone = [...selectedStudentIds];
  const studentIdIndex = selectedStudentIdsClone.indexOf(studentId);

  if (studentIdIndex === -1) {
    selectedStudentIdsClone.push(studentId);
  } else {
    selectedStudentIdsClone.splice(studentIdIndex, 1);
  }

  return selectedStudentIdsClone;
};

const getStudentsGroup = (groups: ListManagerState[], studentId: string) =>
  groups.find((group) =>
    group.students.some((student) => student.id === studentId)
  );

const filterStudentsFromUnassignedGroup = (
  groupId: ListManagerState['id'],
  unassignedSearch: string,
  displayName: ReturnTypeDisplayName,
  student: ListManagerState['students'][number],
  includeClassGroupName: boolean
) => {
  const lowerCaseSearch = unassignedSearch.toLowerCase();
  const lowerCaseName = displayName(student.person).toLowerCase();

  return (
    String(groupId) !== 'unassigned' ||
    lowerCaseName.includes(lowerCaseSearch) ||
    (includeClassGroupName &&
      student.classGroupName?.toLowerCase().includes(lowerCaseSearch))
  );
};

// This behaviour matches the MacOSX finder selection
export const multiSelectTo = (
  studentId: string,
  selectedStudentIds: string[],
  groups: ListManagerState[],
  unassignedSearch: string,
  displayName: ReturnTypeDisplayName,
  includeClassGroupName: boolean
) => {
  // Nothing already selected
  if (!selectedStudentIds.length) {
    return [studentId];
  }

  const groupOfNew = getStudentsGroup(groups, studentId);

  const lastSelectedId = selectedStudentIds[selectedStudentIds.length - 1];
  const groupOfLast = getStudentsGroup(groups, lastSelectedId);

  // Shouldn't happen, but lets keep typescript happy
  if (!groupOfNew || !groupOfLast) return selectedStudentIds;

  const indexOfNew = groupOfNew.students.findIndex(
    ({ id }) => id === studentId
  );
  const indexOfLast = groupOfLast.students.findIndex(
    ({ id }) => id === lastSelectedId
  );

  // multi selecting to another column
  // select everything up to the index of the current item
  if (groupOfNew.id !== groupOfLast.id) {
    return groupOfNew.students
      .slice(0, indexOfNew + 1)
      .filter((student) =>
        filterStudentsFromUnassignedGroup(
          groupOfNew.id,
          unassignedSearch,
          displayName,
          student,
          includeClassGroupName
        )
      )
      .map(({ id }) => id);
  }

  // multi selecting in the same column
  // need to select everything between the last index and the current index inclusive

  // nothing to do here
  if (indexOfNew === indexOfLast) {
    return selectedStudentIds;
  }

  const isSelectingForwards = indexOfNew > indexOfLast;
  const start = isSelectingForwards ? indexOfLast : indexOfNew;
  const end = isSelectingForwards ? indexOfNew : indexOfLast;

  const studentIdsBetween = groupOfNew.students
    .slice(start, end + 1)
    .filter((student) =>
      filterStudentsFromUnassignedGroup(
        groupOfNew.id,
        unassignedSearch,
        displayName,
        student,
        includeClassGroupName
      )
    )
    .map(({ id }) => id);

  // everything inbetween needs to have it's selection toggled.
  // with the exception of the start and end values which will always be selected

  const idsToAdd = studentIdsBetween.filter(
    (id) =>
      // if already selected: then no need to select it again
      !selectedStudentIds.includes(id)
  );

  const sorted = isSelectingForwards ? idsToAdd : [...idsToAdd].reverse();
  const combined = [...selectedStudentIds, ...sorted];

  return combined;
};

export const getGroupsWithDuplicates = (
  groupIdToMoveTo: number,
  studentIds: string[],
  groups: ListManagerState[]
) => {
  const groupIndex = groups.findIndex((group) => group.id === groupIdToMoveTo);

  if (groupIndex === -1) return groups;

  const groupToMoveTo = groups[groupIndex];
  const newStudents = groups.reduce((acc, group) => {
    group.students.forEach((student) => {
      if (studentIds.includes(student.id)) {
        const clonedStudent = {
          ...cloneDeep(student),
          id: `${student.person.partyId}-${nanoid(10)}`,
          isDuplicate: true,
        };
        acc.push(clonedStudent);
      }
    });

    return acc;
  }, [] as ListManagerState['students']);

  const clonedGroup = cloneDeep(groupToMoveTo);
  clonedGroup.students = [...newStudents, ...clonedGroup.students];
  const newGroups = [...groups];
  newGroups[groupIndex] = clonedGroup;

  return newGroups;
};
