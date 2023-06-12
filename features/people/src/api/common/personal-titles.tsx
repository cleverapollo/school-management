import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType, gqlClient, graphql } from '@tyro/api';
import { peopleCommonKeys } from './keys';

const personalTitles = graphql(/* GraphQL */ `
  query catalogue_personalTitles {
    catalogue_personalTitles {
      id
      name
    }
  }
`);

const personalTitlesQuery = () => ({
  queryKey: peopleCommonKeys.personalTitles,
  queryFn: async () => gqlClient.request(personalTitles),
});

export function usePersonalTitles() {
  return useQuery({
    ...personalTitlesQuery(),
    select: ({ catalogue_personalTitles }) => catalogue_personalTitles,
  });
}

export type PersonalTitleOption = UseQueryReturnType<
  typeof usePersonalTitles
>[number];
