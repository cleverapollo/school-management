import { useQuery } from '@tanstack/react-query';
import {
  Forms_InformationRequestListFormFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { infoRequestKeys } from './keys';

const infoRequestFormList = graphql(/* GraphQL */ `
  query forms_listInformationRequestForms(
    $filter: Forms_InformationRequestListFormFilter
  ) {
    forms_listInformationRequestForms(filter: $filter) {
      name
      id {
        name
        provider
        forPartyId
        objectId
      }
      status
      completionDate
      dueDate
      forPerson {
        partyId
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

const infoRequestFormListQuery = (
  filter: Forms_InformationRequestListFormFilter
) => ({
  queryKey: infoRequestKeys.list(filter),
  queryFn: () => gqlClient.request(infoRequestFormList, { filter }),
});

export function useInfoRequestFormList(
  filter: Forms_InformationRequestListFormFilter
) {
  return useQuery({
    ...infoRequestFormListQuery(filter),
    select: ({ forms_listInformationRequestForms }) =>
      forms_listInformationRequestForms,
  });
}

export function getInfoRequestFormList(
  filter: Forms_InformationRequestListFormFilter
) {
  return queryClient.fetchQuery(infoRequestFormListQuery(filter));
}

export type ReturnTypeFromUseInfoRequestFormList = UseQueryReturnType<
  typeof useInfoRequestFormList
>[number];
