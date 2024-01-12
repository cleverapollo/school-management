import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  Sa_SchoolActivityFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { activitiesKeys } from './keys';

const activitiesList = graphql(/* GraphQL */ `
  query activitiesList($filter: Sa_SchoolActivityFilter!) {
    sa_activities(filter: $filter) {
      schoolActivityId
      customGroupId
      lastPublished
      name
      createdBy {
        person {
          firstName
          lastName
          avatarUrl
        }
      }
      dates {
        date
        startTime
        endTime
        partial
      }
      location {
        locationDetails
        inSchoolGrounds
        roomIds
        rooms {
          roomId
          name
        }
      }
      tripPurpose
      notes
      published
      customGroup {
        partyId
        name
        avatarUrl
        relatedSubjectGroups {
          partyId
          name
          subjects {
            name
          }
        }
        studentMembers {
          groupPartyId
          memberCount
          members {
            partyId
            person {
              avatarUrl
              partyId
              firstName
              lastName
            }
          }
        }
        staffMembers {
          groupPartyId
          memberIds
          members {
            partyId
            person {
              avatarUrl
              partyId
              firstName
              lastName
            }
          }
          memberCount
        }
      }
    }
  }
`);

const schoolActivityById = graphql(/* GraphQL */ `
  query activitiesById($filter: Sa_SchoolActivityFilter!) {
    sa_activities(filter: $filter) {
      schoolActivityId
      customGroupId
      lastPublished
      name
      staffAbsenceTypeId
      dates {
        date
        startTime
        endTime
        partial
      }
      location {
        locationDetails
        inSchoolGrounds
        roomIds
        rooms {
          roomId
          name
        }
      }
      tripPurpose
      notes
      published
      customGroup {
        partyId
        name
        avatarUrl
        relatedSubjectGroups {
          partyId
          name
          subjects {
            name
          }
        }
        studentMembers {
          groupPartyId
          memberCount
          members {
            partyId
            person {
              avatarUrl
              partyId
              firstName
              lastName
            }
          }
        }
        staffMembers {
          groupPartyId
          memberIds
          members {
            partyId
            person {
              avatarUrl
              partyId
              firstName
              lastName
            }
          }
          memberCount
        }
      }
    }
  }
`);

const activitiesListQuery = (filter: Sa_SchoolActivityFilter) => ({
  queryKey: activitiesKeys.activities(filter),
  queryFn: () =>
    gqlClient.request(activitiesList, {
      filter,
    }),
});

export function getActivitiesList(filter: Sa_SchoolActivityFilter) {
  return queryClient.fetchQuery(activitiesListQuery(filter));
}

export function useActivitiesList(filter: Sa_SchoolActivityFilter) {
  return useQuery({
    ...activitiesListQuery(filter),
    select: ({ sa_activities }) => sa_activities,
  });
}

const schoolActivityByIdQuery = (filter: Sa_SchoolActivityFilter) => ({
  queryKey: activitiesKeys.activityById(filter),
  queryFn: () =>
    gqlClient.request(schoolActivityById, {
      filter,
    }),
});

export function getSchoolActivityById(filter: Sa_SchoolActivityFilter) {
  return queryClient.fetchQuery(schoolActivityByIdQuery(filter));
}

export function useSchoolActivityById(filter: Sa_SchoolActivityFilter) {
  return useQuery({
    ...schoolActivityByIdQuery(filter),
    select: ({ sa_activities }) => sa_activities[0],
  });
}

export type ReturnTypeFromUseActivitiesList = UseQueryReturnType<
  typeof useActivitiesList
>[number];

export type ReturnTypeFromUseSchoolActivityById = UseQueryReturnType<
  typeof useSchoolActivityById
>;
