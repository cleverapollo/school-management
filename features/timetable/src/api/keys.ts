import {
  TtIndividualViewLessonFilter,
  TtResourceTimetableViewFilter,
} from '@tyro/api';

export const timetableKeys = {
  all: ['timetable'] as const,
  timetable: (filter: TtIndividualViewLessonFilter) =>
    [...timetableKeys.all, filter] as const,
  timetables: (id: number | undefined) => [...timetableKeys.all, id] as const,
  resourceView: (filter: TtResourceTimetableViewFilter) =>
    [...timetableKeys.all, filter] as const,
};
