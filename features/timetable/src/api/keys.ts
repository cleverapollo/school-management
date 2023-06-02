import { TtIndividualViewLessonFilter } from '@tyro/api';

export const timetableKeys = {
  all: ['timetable'] as const,
  timetable: (filter: TtIndividualViewLessonFilter) =>
    [...timetableKeys.all, filter] as const,
  timetables: (id: number | undefined) => [...timetableKeys.all, id] as const,
};
