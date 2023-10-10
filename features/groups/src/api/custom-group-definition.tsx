import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Core_CustomGroupDefinitionFilter,
  Core_UpsertCustomGroupDefinition,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { groupsKeys } from './keys';

const customGroupDefinition = graphql(/* GraphQL */ `
  query core_customGroupDefinition($filter: Core_CustomGroupDefinitionFilter!) {
    core_customGroupDefinition(filter: $filter) {
      id
      name
      organisers {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
      }
      staffStatic {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
      }
      studentsStatic {
        person {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        partyId
        classGroup {
          name
        }
        extensions {
          priority
        }
      }
    }
  }
`);

const saveCustomGroupDefinition = graphql(/* GraphQL */ `
  mutation saveCustomGroupDefinition(
    $input: Core_UpsertCustomGroupDefinition!
  ) {
    core_upsertCustomGroupDefinition(input: $input) {
      success
    }
  }
`);

const customGroupDefinitionQuery = (
  filter: Core_CustomGroupDefinitionFilter
) => ({
  queryKey: groupsKeys.custom.definition(filter),
  queryFn: async () => {
    const { core_customGroupDefinition: customGroupData } =
      await gqlClient.request(customGroupDefinition, { filter });

    // TODO: spread dynamic students/staff when BE sends
    const organisers = [...(customGroupData.organisers || [])];
    const students = [...(customGroupData.studentsStatic || [])];
    const staff = [...(customGroupData.staffStatic || [])];

    return {
      core_customGroupDefinition: {
        ...customGroupData,
        organisers,
        students,
        staff,
        memberCount: organisers.length + students.length + staff.length,
      },
    };
  },
});

export function getCustomGroupDefinition(
  filter: Core_CustomGroupDefinitionFilter
) {
  return queryClient.fetchQuery(customGroupDefinitionQuery(filter));
}

export function useCustomGroupDefinition(
  filter: Core_CustomGroupDefinitionFilter
) {
  return useQuery({
    ...customGroupDefinitionQuery(filter),
    select: ({ core_customGroupDefinition }) => core_customGroupDefinition,
  });
}

export function useSaveCustomGroupDefinition() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_UpsertCustomGroupDefinition) =>
      gqlClient.request(saveCustomGroupDefinition, { input }),
    onSuccess: async (_, customGroup) => {
      await queryClient.invalidateQueries(groupsKeys.custom.all());

      toast(
        customGroup?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}

export type ReturnTypeFromUseCustomGroupDefinition = UseQueryReturnType<
  typeof useCustomGroupDefinition
>;
