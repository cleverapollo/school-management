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
      timetableId
      liveStatus {
        totalChanges
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
          groupDiffs {
            newGroup {
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
              partyId
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
            }
            oldGroup {
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
              partyId
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
            }
            type
            teachersChanged
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
    select: ({ tt_timetables }) => {
      const { timetableId, liveStatus } = tt_timetables[0];

      return {
        timetableId,
        totalChanges: liveStatus?.totalChanges ?? 0,
        lessonDiffs: liveStatus?.publishDiff?.lessonDiffs ?? [],
        groupDiffs: liveStatus?.publishDiff?.groupDiffs ?? [],
      };
    },
  });
}

export type ReturnTypeFromUseUnpublishedTimetableChanges = UseQueryReturnType<
  typeof useUnpublishedTimetableChanges
>;
