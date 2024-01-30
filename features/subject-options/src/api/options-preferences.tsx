import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  PreferencesFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsPreferences = graphql(/* GraphQL */ `
  query options_preferences($filter: PreferencesFilter) {
    options_preferences(filter: $filter) {
      id {
        optionId
        studentPartyId
      }
      student {
        partyId
        firstName
        lastName
        avatarUrl
        type
      }
      choices {
        id {
          subjectSetIdx
          preferenceIdx
        }
        subject {
          id
          name
          colour
        }
      }
    }
  }
`);

const optionsPreferencesQuery = (filter: PreferencesFilter) => ({
  queryKey: optionsKeys.preferences(filter),
  queryFn: () => gqlClient.request(optionsPreferences, { filter }),
});

export function useOptionsPreferences(filter: PreferencesFilter) {
  return useQuery({
    ...optionsPreferencesQuery(filter),
    select: ({ options_preferences }) => options_preferences,
  });
}

export function getOptionsPreferences(filter: PreferencesFilter) {
  return queryClient.fetchQuery(optionsPreferencesQuery(filter));
}

export type ReturnTypeFromUseOptionsPreferences = UseQueryReturnType<
  typeof useOptionsPreferences
>[number];
