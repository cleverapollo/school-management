import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SubjectFilter,
  UpsertSubject,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

const catalogueSubjects = graphql(/* GraphQL */ `
  query catalogueSubjects($filter: SubjectFilter) {
    catalogue_subjects(filter: $filter) {
      id
      name
      description
      shortCode
      nationalCode
      subjectSource
      examinable
      colour
      icon
      active
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
  all: (filter?: SubjectFilter) => ['catalogue_subjects', filter] as const,
};

const catalogueSubjectsQuery = (filter?: SubjectFilter) => ({
  queryKey: catalogueSubjectsKeys.all(filter),
  queryFn: async () => gqlClient.request(catalogueSubjects, { filter }),
});

export function getCatalogueSubjects(filter?: SubjectFilter) {
  return queryClient.fetchQuery(catalogueSubjectsQuery(filter));
}

export function useCatalogueSubjects(filter?: SubjectFilter) {
  return useQuery({
    ...catalogueSubjectsQuery(filter),
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
      queryClient.invalidateQueries(catalogueSubjectsKeys.all());
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
