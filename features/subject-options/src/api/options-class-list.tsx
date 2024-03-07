import {
  gqlClient,
  graphql,
  Options_ClmFilter,
  queryClient,
  UseQueryReturnType,
  OptionsSol_UpsertSubjectGroupMembership,
  Options_ClmQuery,
} from '@tyro/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useCallback } from 'react';
import { optionsKeys } from './keys';

const optionsClassLists = graphql(/* GraphQL */ `
  query options_clm($filter: Options_ClmFilter!) {
    options_clm(filter: $filter) {
      blockIdx
      subjectGroups {
        id
        subjectGroupName
        students {
          classGroup {
            name
          }
          personalInformation {
            gender
          }
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
    }
  }
`);

const updateOptionsSubjectGroupMemberships = graphql(/* GraphQL */ `
  mutation optionsSol_upsertSubjectGroupMemberships(
    $input: OptionsSol_UpsertSubjectGroupMembership!
  ) {
    optionsSol_upsertSubjectGroupMemberships(input: $input) {
      success
    }
  }
`);

const optionsClassListsQuery = (filter: Options_ClmFilter) => ({
  queryKey: optionsKeys.classLists(filter),
  queryFn: () => gqlClient.request(optionsClassLists, { filter }),
});

export function useOptionsClassLists(
  filter: Options_ClmFilter,
  enabled = true
) {
  return useQuery({
    ...optionsClassListsQuery(filter),
    select: useCallback(
      ({ options_clm }: Options_ClmQuery) => ({
        id: nanoid(4),
        ...options_clm,
      }),
      []
    ),
    enabled,
  });
}

export function getOptionsClassLists(filter: Options_ClmFilter) {
  return queryClient.fetchQuery(optionsClassListsQuery(filter));
}

export function useUpdateOptionsSubjectGroupMemberships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: OptionsSol_UpsertSubjectGroupMembership) =>
      gqlClient.request(updateOptionsSubjectGroupMemberships, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}

export type ReturnTypeFromUseOptionsClassLists = UseQueryReturnType<
  typeof useOptionsClassLists
>;
