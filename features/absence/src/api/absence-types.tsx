import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Swm_StaffAbsenceTypeFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
  Swm_UpsertStaffAbsenceType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export type ReturnTypeFromUseAbsenceTypes = UseQueryReturnType<
  typeof useAbsenceTypes
>[number];

const absenceTypes = graphql(/* GraphQL */ `
  query swm_absenceTypes($filter: SWM_StaffAbsenceTypeFilter) {
    swm_absenceTypes(filter: $filter) {
      absenceTypeId
      name
      nameTextId
      description
      descriptionTextId
      code
      availableForRequests
    }
  }
`);

const createAbsenceType = graphql(/* GraphQL */ `
  mutation swm_upsertAbsenceType($input: [SWM_UpsertStaffAbsenceType]) {
    swm_upsertAbsenceType(input: $input) {
      absenceTypeId
    }
  }
`);

const absenceTypesKeys = {
  list: ['absence', 'codes'] as const,
  createOrUpdateAbsenceType: () =>
    [...absenceTypesKeys.list, 'createOrUpdateAbsenceType'] as const,
};

const absenceTypesQuery = (filter: Swm_StaffAbsenceTypeFilter) => ({
  queryKey: absenceTypesKeys.list,
  queryFn: () => gqlClient.request(absenceTypes, { filter }),
});

export function useAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return useQuery({
    ...absenceTypesQuery(filter),
    select: ({ swm_absenceTypes }) => swm_absenceTypes,
  });
}

export function getAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(absenceTypesQuery(filter));
}

export function useCreateOrUpdateAbsenceType() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: absenceTypesKeys.createOrUpdateAbsenceType(),
    mutationFn: async (input: Swm_UpsertStaffAbsenceType[]) =>
      // @ts-ignore
      gqlClient.request(createAbsenceType, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, [code]) => {
      if (code?.absenceTypeId) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(absenceTypesKeys.list);
    },
  });
}
