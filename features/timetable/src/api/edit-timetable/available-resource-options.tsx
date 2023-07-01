import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  TtSwapRoomFilter,
  TtSwapTeacherFilter,
} from '@tyro/api';
import { timetableKeys } from '../keys';

const availableTeachersOptionsForResource = graphql(/* GraphQL */ `
  query tt_swapTeacherOptions($filter: TTSwapTeacherFilter!) {
    tt_swapTeacherOptions(filter: $filter) {
      timeslots {
        id {
          gridIdx
          dayIdx
          periodIdx
        }
        info {
          dayOfWeek
          startTime
          endTime
        }
      }
      teachers {
        staffId
        teacher {
          person {
            partyId
            title {
              id
              nameTextId
              name
            }
            firstName
            lastName
            avatarUrl
            type
          }
        }
        lessonOnTimeslots {
          id {
            lessonIdx
            lessonInstanceIdx
            timetableGroupId
          }
          partyGroup {
            name
          }
        }
      }
    }
  }
`);

const availableRoomsOptionsForResource = graphql(/* GraphQL */ `
  query tt_swapRoomOptions($filter: TTSwapRoomFilter!) {
    tt_swapRoomOptions(filter: $filter) {
      timeslots {
        id {
          gridIdx
          dayIdx
          periodIdx
        }
        info {
          dayOfWeek
          startTime
          endTime
        }
      }
      rooms {
        roomId
        room {
          name
          capacity
          description
          pools
        }
        lessonOnTimeslots {
          id {
            lessonIdx
            lessonInstanceIdx
            timetableGroupId
          }
          partyGroup {
            name
          }
        }
      }
    }
  }
`);

const availableTeachersForResourceQuery = (filter: TtSwapTeacherFilter) => ({
  queryKey: timetableKeys.availableTeachersForResource(filter),
  queryFn: async () =>
    gqlClient.request(availableTeachersOptionsForResource, { filter }),
});

export function useAvailableTeachersForResource(
  enabled: boolean,
  filter: TtSwapTeacherFilter
) {
  return useQuery({
    ...availableTeachersForResourceQuery(filter),
    enabled,
    select: ({ tt_swapTeacherOptions }) => tt_swapTeacherOptions,
  });
}

const availableRoomsForResourceQuery = (filter: TtSwapRoomFilter) => ({
  queryKey: timetableKeys.availableRoomsForResource(filter),
  queryFn: async () =>
    gqlClient.request(availableRoomsOptionsForResource, { filter }),
});

export function useAvailableRoomsForResource(
  enabled: boolean,
  filter: TtSwapRoomFilter
) {
  return useQuery({
    ...availableRoomsForResourceQuery(filter),
    enabled,
    select: ({ tt_swapRoomOptions }) => tt_swapRoomOptions,
  });
}
