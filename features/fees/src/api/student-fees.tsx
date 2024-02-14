import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  StudentFeeFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const studentFees = graphql(/* GraphQL */ `
  query fees_studentFees($filter: StudentFeeFilter) {
    fees_studentFees(filter: $filter) {
      id {
        feeId
        studentPartyId
      }
      person {
        partyId
        firstName
        lastName
        avatarUrl
      }
      feeName
      dueDate
      amount
      amountPaid
      amountDue
      feeType
      feeStatus
      discounts {
        id
        name
        description
        discountType
        value
        siblingDiscount
      }
    }
  }
`);

const studentFeesQuery = (filter: StudentFeeFilter) => ({
  queryKey: feeKeys.studentFees(filter),
  queryFn: () => gqlClient.request(studentFees, { filter }),
});

export function getStudentFees(filter: StudentFeeFilter) {
  return queryClient.fetchQuery(studentFeesQuery(filter));
}

export function useStudentFees(filter: StudentFeeFilter) {
  return useQuery({
    ...studentFeesQuery(filter),
    select: ({ fees_studentFees }) => fees_studentFees,
  });
}

export type ReturnTypeFromUseStudentFees = UseQueryReturnType<
  typeof useStudentFees
>[number];
