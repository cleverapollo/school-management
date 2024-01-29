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

export type ReturnTypeFromUseOptionsSetupList = UseQueryReturnType<
  typeof useOptionsSetupList
>[number];
