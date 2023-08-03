import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  Swm_StaffAbsenceTypeFilter,
  Swm_UpsertStaffAbsenceType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { substitutionKeys } from './keys';

export type ReturnTypeFromUseAbsenceTypes = UseQueryReturnType<
  typeof useStaffWorkAbsenceTypes
>[number];

const staffWorkAbsenceTypes = graphql(/* GraphQL */ `
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

const staffWorkAbsenceTypesQuery = (filter: Swm_StaffAbsenceTypeFilter) => ({
  queryKey: substitutionKeys.absenceTypes(filter),
  queryFn: () => gqlClient.request(staffWorkAbsenceTypes, { filter }),
});

export function getStaffWorkAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return queryClient.fetchQuery(staffWorkAbsenceTypesQuery(filter));
}

export function useStaffWorkAbsenceTypes(filter: Swm_StaffAbsenceTypeFilter) {
  return useQuery({
    ...staffWorkAbsenceTypesQuery(filter),
    select: ({ swm_absenceTypes }) =>
      swm_absenceTypes.sort((a, b) => a.name.localeCompare(b.name)) ?? [],
  });
}

export function useCreateOrUpdateAbsenceType() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Swm_UpsertStaffAbsenceType[]) =>
      gqlClient.request(createAbsenceType, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, [code]) => {
      toast(
        code?.absenceTypeId
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
      queryClient.invalidateQueries(substitutionKeys.absenceTypes({}));
    },
  });
}
