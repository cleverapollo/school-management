import { Sa_SchoolActivityFilter } from '@tyro/api';

export const activitiesKeys = {
  all: ['activities'] as const,
  activities: (filter: Sa_SchoolActivityFilter) =>
    [...activitiesKeys.all, 'activities', filter] as const,
  activityById: (filter: Sa_SchoolActivityFilter) =>
    [...activitiesKeys.all, 'activityById', filter] as const,
  rooms: () => [...activitiesKeys.all, 'rooms'] as const,
};
