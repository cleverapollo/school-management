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
  WithdrawParentalAttendanceRequest,
  ParentalAttendanceRequestStatus,
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
        description
      }
      approvedBy {
        firstName
        lastName
      }
      approvedByPartyId
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
      studentNew {
        person {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        extensions {
          priority
        }
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

const withdrawAbsentRequest = graphql(/* GraphQL */ `
  mutation attendance_withdrawParentalAttendanceRequest(
    $input: WithdrawParentalAttendanceRequest
  ) {
    attendance_withdrawParentalAttendanceRequest(input: $input) {
      success
    }
  }
`);

const pendingAbsentRequestCount = graphql(/* GraphQL */ `
  query pendingAbsentRequestCount($filter: ParentalAttendanceRequestFilter) {
    attendance_parentalAttendanceRequests(filter: $filter) {
      id
    }
  }
`);

// Note: When we have spare time, we need to get backend to create a new query that just sends us the count as it will be more efficient for the backend when pooling it
const pendingAbsentRequestCountQuery = () => ({
  queryKey: attendanceKeys.all,
  queryFn: async () => {
    const { attendance_parentalAttendanceRequests: pendingAbsentRequest } =
      await gqlClient.request(pendingAbsentRequestCount, {
        filter: { status: ParentalAttendanceRequestStatus.Pending },
      });

    return pendingAbsentRequest.length;
  },
});

export function usePendingAbsentRequestCount() {
  return useQuery({
    ...pendingAbsentRequestCountQuery(),
    refetchInterval: 1000 * 60 * 5,
  });
}

const absentRequestsQuery = (filter: ParentalAttendanceRequestFilter) => ({
  queryKey: attendanceKeys.absentRequests(filter),
  queryFn: () => gqlClient.request(absentRequests, { filter }),
});

export function useAbsentRequests(filter: ParentalAttendanceRequestFilter) {
  return useQuery({
    ...absentRequestsQuery(filter),
    select: ({ attendance_parentalAttendanceRequests }) =>
      attendance_parentalAttendanceRequests.map((request) => ({
        ...request,
        student: request.studentNew,
      })),
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
    onSuccess: async (_, [code]) => {
      await queryClient.invalidateQueries(attendanceKeys.absentRequests({}));
      toast(
        code?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
  });
}

export function useWithdrawAbsentRequest() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: WithdrawParentalAttendanceRequest) =>
      gqlClient.request(withdrawAbsentRequest, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async (_, code) => {
      await queryClient.invalidateQueries(attendanceKeys.absentRequests({}));
      toast(
        code?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
  });
}
