import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
  ParentalAttendanceRequestFilter,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import { attendanceKeys } from './keys';

export type ReturnTypeFromUseAbsentRequests = UseQueryReturnType<
  typeof useAbsentRequests
>[number];

const absentRequests = graphql(/* GraphQL */ `
  query attendance_parentalAttendanceRequests(
    $filter: ParentalAttendanceRequestFilter
  ) {
    attendance_parentalAttendanceRequests(filter: $filter) {
      id
      adminNote
      attendanceCode {
        id
        code
        name
      }
      attendanceCodeId
      contactPartyId
      from
      parentNote
      requestType
      status
      studentPartyId
      to
      classGroup {
        name
      }
      contact {
        person {
          avatarUrl
          firstName
          lastName
        }
        relationships {
          relationshipType
          studentPartyId
        }
      }
      createdOn
      student {
        avatarUrl
        firstName
        lastName
      }
    }
  }
`);

const createAbsentRequest = graphql(/* GraphQL */ `
  mutation attendance_saveParentalAttendanceRequest(
    $input: [SaveParentalAttendanceRequest]
  ) {
    attendance_saveParentalAttendanceRequest(input: $input) {
      id
    }
  }
`);

const absentRequestsQuery = (filter: ParentalAttendanceRequestFilter) => ({
  queryKey: attendanceKeys.absentRequests(filter),
  queryFn: () => gqlClient.request(absentRequests, { filter }),
});

export function useAbsentRequests(filter: ParentalAttendanceRequestFilter) {
  return useQuery({
    ...absentRequestsQuery(filter),
    select: ({ attendance_parentalAttendanceRequests }) =>
      attendance_parentalAttendanceRequests,
  });
}

export function getAbsentRequests(filter: ParentalAttendanceRequestFilter) {
  return queryClient.fetchQuery(absentRequestsQuery(filter));
}

export function useCreateOrUpdateAbsentRequest() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveParentalAttendanceRequest[]) =>
      gqlClient.request(createAbsentRequest, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, [code]) => {
      toast(
        code?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
      queryClient.invalidateQueries(attendanceKeys.absentRequests({}));
    },
  });
}
