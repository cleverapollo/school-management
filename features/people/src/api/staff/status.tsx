import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@tyro/api';
import { peopleKeys } from '../keys';

const compositeStaffStatus = {
  currentLocation: {
    room: [
      {
        roomId: '123',
        name: 'E101',
        capacity: '',
      },
    ],
    lesson: '2Eng-G',
    eventId: '12345',
  },
};

export type CompositeStaffStatus = typeof compositeStaffStatus;

const statusQuery = (staffId: number | undefined) => ({
  queryKey: peopleKeys.staff.status(staffId),
  queryFn: async (): Promise<typeof compositeStaffStatus> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(compositeStaffStatus), Math.random() * 1000);
    }),
});

export function getStaffStatus(staffId: number | undefined) {
  return queryClient.fetchQuery(statusQuery(staffId));
}

export function useStaffStatus(staffId: number | undefined) {
  return useQuery({
    ...statusQuery(staffId),
    select: (composite_staffStatus) => composite_staffStatus,
  });
}
