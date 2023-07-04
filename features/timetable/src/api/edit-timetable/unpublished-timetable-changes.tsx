import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  TtTimetableFilter,
  UseQueryReturnType,
} from '@tyro/api';

import { timetableKeys } from '../keys';

const unpublishedTimetableEdits = graphql(/* GraphQL */ `
  query tt_unpublishedChanges($filter: TTTimetableFilter) {
    tt_timetables(filter: $filter) {
      liveStatus {
        publishDiff {
          lessonDiffs {
            newLesson {
              id {
                lessonIdx
                lessonInstanceIdx
                timetableGroupId
              }
              timeslotId {
                gridIdx
                dayIdx
                periodIdx
              }
              timeslotInfo {
                startTime
                endTime
              }
              partyGroup {
                __typename
                partyId
                name
                avatarUrl
                ... on SubjectGroup {
                  subjects {
                    name
                    colour
                  }
                }
              }
              room {
                roomId
                name
              }
              teachers {
                person {
                  partyId
                  title {
                    id
                    name
                    nameTextId
                  }
                  firstName
                  lastName
                  avatarUrl
                  type
                }
              }
              spread
            }
            oldLesson {
              id {
                lessonIdx
                lessonInstanceIdx
                timetableGroupId
              }
              timeslotId {
                gridIdx
                dayIdx
                periodIdx
              }
              timeslotInfo {
                startTime
                endTime
              }
              partyGroup {
                __typename
                partyId
                name
                avatarUrl
                ... on SubjectGroup {
                  subjects {
                    name
                    colour
                  }
                }
              }
              room {
                roomId
                name
              }
              teachers {
                person {
                  partyId
                  title {
                    id
                    name
                    nameTextId
                  }
                  firstName
                  lastName
                  avatarUrl
                  type
                }
              }
              spread
            }
            type
            roomChanged
            teachersChanged
            timeslotChanged
          }
        }
      }
    }
  }
`);

const unpublishedChangesQuery = (filter: TtTimetableFilter) => ({
  queryKey: timetableKeys.unpublishedChanges(filter),
  queryFn: async () => gqlClient.request(unpublishedTimetableEdits, { filter }),
});

export function useUnpublishedTimetableChanges(
  filter: TtTimetableFilter,
  enabled: boolean
) {
  return useQuery({
    ...unpublishedChangesQuery(filter),
    enabled,
    select: ({ tt_timetables }) => tt_timetables?.[0]?.liveStatus?.publishDiff,
  });
}

export type ReturnTypeFromUseUnpublishedTimetableChanges = UseQueryReturnType<
  typeof useUnpublishedTimetableChanges
>;
