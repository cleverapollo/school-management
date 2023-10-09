import {
  TtIndividualViewLessonFilter,
  TtResourceTimetableViewFilter,
  TtSwapRoomFilter,
  TtSwapTeacherFilter,
  TtTimetableFilter,
  Tt_GroupsFilter,
  Tt_AddLessonFilter,
  Tt_EditLessonFilter,
} from '@tyro/api';

export const timetableKeys = {
  all: ['timetable'] as const,
  timetableList: (filter: TtTimetableFilter) =>
    [...timetableKeys.all, filter] as const,
  unpublishedChanges: (filter: TtTimetableFilter) =>
    [...timetableKeys.all, 'unpublishedChanges', filter] as const,
  timetable: (filter: TtIndividualViewLessonFilter) =>
    [...timetableKeys.all, filter] as const,
  timetables: (id: number | undefined) => [...timetableKeys.all, id] as const,
  resourceView: (filter: TtResourceTimetableViewFilter) =>
    [...timetableKeys.all, 'resourceView', filter] as const,
  availableTeachersForResource: (filter: TtSwapTeacherFilter) =>
    [...timetableKeys.all, 'teachersForResource', filter] as const,
  availableRoomsForResource: (filter: TtSwapRoomFilter) =>
    [...timetableKeys.all, 'roomsForResource', filter] as const,
  subjectGroups: (filter: Tt_GroupsFilter) =>
    [...timetableKeys.all, 'ttSubjectGroups', filter] as const,
  addLessonsOptions: (filter: Tt_AddLessonFilter) =>
    [...timetableKeys.all, 'addLessonsOptions', filter] as const,
  editLessonsOptions: (filter: Tt_EditLessonFilter) =>
    [...timetableKeys.all, 'editLessonsOptions', filter] as const,
  search: (query: string) => [...timetableKeys.all, 'search', query] as const,
};
