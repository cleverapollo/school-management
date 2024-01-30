import { useQuery } from '@tanstack/react-query';
import {
  Forms_InformationRequestViewFormFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { infoRequestKeys } from './keys';

const infoRequestFormSetupDetails = graphql(/* GraphQL */ `
  query forms_viewInformationRequestForms(
    $filter: Forms_InformationRequestViewFormFilter
  ) {
    forms_viewInformationRequestForms(filter: $filter) {
      id {
        name
        provider
        forPartyId
        objectId
      }
      title
      fields {
        header
        fields {
          __typename
          ... on Forms_FormFieldSubGroup {
            formFieldType
            header
            fields {
              formFieldType
              id
              label
              type
              options {
                id
                name
              }
              gridWidth {
                xs
                sm
                md
                lg
                xl
              }
            }
            gridWidth {
              xs
              sm
              md
              lg
              xl
            }
          }
          ... on Forms_FormFieldItem {
            formFieldType
            id
            label
            type
            options {
              id
              name
            }
            gridWidth {
              xs
              sm
              md
              lg
              xl
            }
          }
        }
      }
    }
  }
`);

const infoRequestFormSetupDetailsQuery = (
  filter: Forms_InformationRequestViewFormFilter
) => ({
  queryKey: infoRequestKeys.setup(filter),
  queryFn: () => gqlClient.request(infoRequestFormSetupDetails, { filter }),
});

export function useInfoRequestFormSetupDetails(
  filter: Forms_InformationRequestViewFormFilter
) {
  return useQuery({
    ...infoRequestFormSetupDetailsQuery(filter),
    select: ({ forms_viewInformationRequestForms }) =>
      forms_viewInformationRequestForms,
  });
}

export function getInfoRequestFormSetupDetails(
  filter: Forms_InformationRequestViewFormFilter
) {
  return queryClient.fetchQuery(infoRequestFormSetupDetailsQuery(filter));
}

export type ReturnTypeFromUseInfoRequestFormSetupDetails = UseQueryReturnType<
  typeof useInfoRequestFormSetupDetails
>;
