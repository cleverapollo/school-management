import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Options_OptionFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsSetupList = graphql(/* GraphQL */ `
  query options_options($filter: Options_OptionFilter) {
    options_options(filter: $filter) {
      id
      name
      yearGroup {
        name
      }
      publishedToParents
      parentsDueByDate
      parentsDescription
      studentCount
      studentPreferencesCompleteCount
    }
  }
`);

const optionsSetup = graphql(/* GraphQL */ `
  query optionsSetup($filter: Options_OptionFilter) {
    options_options(filter: $filter) {
      id
      name
      yearGroup {
        name
      }
      students {
        partyId
        firstName
        lastName
        avatarUrl
        type
      }
      subjectSets {
        id {
          optionId
          idx
        }
        name
        canChoose
        mustGet
        poolIdx
        subjects {
          id
          name
          shortCode
          colour
        }
      }
    }
  }
`);

const optionsSetupListQuery = (filter: Options_OptionFilter) => ({
  queryKey: optionsKeys.setupList(filter),
  queryFn: () => gqlClient.request(optionsSetupList, { filter }),
});

export function useOptionsSetupList(filter: Options_OptionFilter) {
  return useQuery({
    ...optionsSetupListQuery(filter),
    select: ({ options_options }) => options_options,
  });
}

export function getOptionsSetupList(filter: Options_OptionFilter) {
  return queryClient.fetchQuery(optionsSetupListQuery(filter));
}

const optionsSetupQuery = (id: number) => {
  const filter = { ids: [id] };

  return {
    queryKey: optionsKeys.setup(filter),
    queryFn: () => gqlClient.request(optionsSetup, { filter }),
  };
};

export function useOptionsSetup(id: number) {
  return useQuery({
    ...optionsSetupQuery(id),
    select: ({ options_options }) => options_options?.[0],
  });
}

export function getOptionsSetup(id: number) {
  return queryClient.fetchQuery(optionsSetupQuery(id));
}

export type ReturnTypeFromUseOptionsSetupList = UseQueryReturnType<
  typeof useOptionsSetupList
>[number];

export type ReturnTypeFromUseOptionsSetup = UseQueryReturnType<
  typeof useOptionsSetup
>;
