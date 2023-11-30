import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { activitiesKeys } from './keys';

const customGroupForSchoolActivities = graphql(/* GraphQL */ `
  query customGroupForSchoolActivities($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      staff {
        avatarUrl
        firstName
        lastName
      }
      students {
        partyId
        classGroup {
          name
        }
        person {
          partyId
          firstName
          lastName
          avatarUrl
        }
        extensions {
          priority
        }
      }
    }
  }
`);

const customGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: activitiesKeys.customGroupByID(id),
  queryFn: async () =>
    gqlClient.request(customGroupForSchoolActivities, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
});

export function getCustomGroupById(id: number | undefined) {
  return queryClient.fetchQuery(customGroupsByIdQuery(id));
}

export function useCustomGroupById(id: number | undefined) {
  return useQuery({
    ...customGroupsByIdQuery(id),
    select: ({ generalGroups }) => {
      const [group] = generalGroups || [];

      return group;
    },
  });
}
