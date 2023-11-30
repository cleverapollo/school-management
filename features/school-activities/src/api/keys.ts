import {
  Sa_SchoolActivityFilter,
  Sa_LessonsNeedingCoverFilter,
  Sa_ClassAwayFilter,
} from '@tyro/api';

export const activitiesKeys = {
  all: ['activities'] as const,
  activities: (filter: Sa_SchoolActivityFilter) =>
    [...activitiesKeys.all, 'activities', filter] as const,
  activityById: (filter: Sa_SchoolActivityFilter) =>
    [...activitiesKeys.all, 'activityById', filter] as const,
  rooms: () => [...activitiesKeys.all, 'rooms'] as const,
  classAway: (filter: Sa_ClassAwayFilter) =>
    [...activitiesKeys.all, 'classAway', filter] as const,
  lessonsNeedingCover: (filter: Sa_LessonsNeedingCoverFilter) =>
    [...activitiesKeys.all, 'lessonsNeedingCover', filter] as const,
  customGroupByID: (id: number | undefined) =>
    [...activitiesKeys.all, 'customGroupByID', id] as const,
};
