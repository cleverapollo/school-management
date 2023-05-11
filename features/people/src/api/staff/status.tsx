import { useQuery } from '@tanstack/react-query';
import { AttendanceCodeType, gqlClient, graphql, queryClient } from '@tyro/api';


const compositeStaffStatus = {
  currentLocation: {
    room: [{
      roomId: '123',
      name: 'E101',
      capacity: ''
    }],
    lesson: '2Eng-G',
    eventId: '12345',
    currentAttendance: {
      attendanceCodeName: '',
      codeType: AttendanceCodeType.Late
    }
  }
};

export type CompositeStaffStatus = typeof compositeStaffStatus;


export const staffStatusKeys = {
  all: ['people', 'staff', 'status'] as const,
  details: (staffId: number | undefined) =>
    [...staffStatusKeys.all, staffId] as const,
};

const statusQuery = (staffId: number | undefined) => ({
  queryKey: staffStatusKeys.details(staffId),
  queryFn: async (): Promise<typeof compositeStaffStatus> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(compositeStaffStatus), Math.random() * 1000);
    }),
  staleTime: 1000 * 60 * 5,
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
