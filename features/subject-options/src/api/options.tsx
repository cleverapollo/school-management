import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  OptionFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsSetupList = graphql(/* GraphQL */ `
  query options_options($filter: OptionFilter) {
    options_options(filter: $filter) {
      id
      name
      yearGroupEnrolmentParty {
        name
      }
      publishedToParents
      parentsDueByDate
      parentsDescription
    }
  }
`);

const optionsSetup = graphql(/* GraphQL */ `
  query optionsSetup($filter: OptionFilter) {
    options_options(filter: $filter) {
      id
      name
      yearGroupEnrolmentParty {
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
        poolIdx
        subjects {
          id
          name
          colour
        }
      }
    }
  }
`);

const optionsSetupListQuery = (filter: OptionFilter) => ({
  queryKey: optionsKeys.setupList(filter),
  queryFn: () => gqlClient.request(optionsSetupList, { filter }),
});

export function useOptionsSetupList(filter: OptionFilter) {
  return useQuery({
    ...optionsSetupListQuery(filter),
    select: ({ options_options }) => options_options,
  });
}

export function getOptionsSetupList(filter: OptionFilter) {
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
