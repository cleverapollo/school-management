import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UpsertSubject,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

const catalogueSubjects = graphql(/* GraphQL */ `
  query catalogueSubjects {
    catalogue_subjects {
      id
      name
      description
      shortCode
      nationalCode
      subjectSource
      colour
      icon
    }
  }
`);

const updateCatalogueSubjects = graphql(/* GraphQL */ `
  mutation catalogue_upsertSubjects($input: [UpsertSubject!]!) {
    catalogue_upsertSubjects(input: $input) {
      success
      message
    }
  }
`);

export const catalogueSubjectsKeys = {
  all: ['catalogue_subjects'] as const,
};

const catalogueSubjectsQuery = {
  queryKey: catalogueSubjectsKeys.all,
  queryFn: async () => gqlClient.request(catalogueSubjects),
};

export function getCatalogueSubjects() {
  return queryClient.fetchQuery(catalogueSubjectsQuery);
}

export function useCatalogueSubjects() {
  return useQuery({
    ...catalogueSubjectsQuery,
    select: ({ catalogue_subjects }) => catalogue_subjects,
  });
}

export function useUpdateCatalogueSubjects() {
  const { toast } = useToast();
  const { t } = useTranslation(['settings']);

  return useMutation({
    mutationFn: (input: UpsertSubject[]) =>
      gqlClient.request(updateCatalogueSubjects, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(catalogueSubjectsKeys.all);
      toast(t('settings:successfullyUpdatedSubjects'), {
        variant: 'success',
      });
    },
    onError: () => {
      toast(t('settings:updateToSubjectsUnsuccessful'), {
        variant: 'error',
      });
    },
  });
}

export type CatalogueSubjectOption = UseQueryReturnType<
  typeof useCatalogueSubjects
>[number];
