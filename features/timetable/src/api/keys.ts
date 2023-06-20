import {
  TtIndividualViewLessonFilter,
  TtResourceTimetableViewFilter,
  TtSwapRoomFilter,
  TtSwapTeacherFilter,
} from '@tyro/api';

export const timetableKeys = {
  all: ['timetable'] as const,
  timetable: (filter: TtIndividualViewLessonFilter) =>
    [...timetableKeys.all, filter] as const,
  timetables: (id: number | undefined) => [...timetableKeys.all, id] as const,
  resourceView: (filter: TtResourceTimetableViewFilter) =>
    [...timetableKeys.all, 'resourceView', filter] as const,
  availableTeachersForResource: (filter: TtSwapTeacherFilter) =>
    [...timetableKeys.all, 'teachersForResource', filter] as const,
  availableRoomsForResource: (filter: TtSwapRoomFilter) =>
    [...timetableKeys.all, 'roomsForResource', filter] as const,
};
