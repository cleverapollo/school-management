import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Attendance_BulkAttendanceActionFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from '../keys';

const bulkAttendance = graphql(/* GraphQL */ `
  query attendance_bulkAttendanceActions(
    $filter: Attendance_BulkAttendanceActionFilter!
  ) {
    attendance_bulkAttendanceActions(filter: $filter) {
      id
      attendanceForPartyIds
      parties {
        ... on PartyPerson {
          __typename
          person {
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
        ... on SubjectGroup {
          partyId
          actualName
          name
          avatarUrl
          __typename
        }
        ... on GeneralGroup {
          __typename
          partyId
          generalGroupType
          name
          classGroupInfo {
            __typename
          }
        }
        ... on ProgrammeStageEnrollment {
          __typename
          partyId
          name
        }
        ... on YearGroupEnrollment {
          __typename
          partyId
          name
        }
        ... on Staff {
          __typename
          person {
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
        ... on StudentContact {
          __typename
          person {
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
      attendanceCodeId
      attendanceCode {
        id
        name
        description
        code
        active
        visibleForTeacher
        visibleForContact
        nameTextId
        descriptionTextId
        codeType
        sessionCodeType
        custom
      }
      startDate
      endDate
      leavesAt
      returnsAt
      partial
      note
      createdBy {
        userId
        partyId
        person {
          partyId
          firstName
          lastName
          avatarUrl
        }
      }
      createdOn
    }
  }
`);

const bulkAttendanceQuery = (
  filter: Attendance_BulkAttendanceActionFilter
) => ({
  queryKey: attendanceKeys.bulkAttendance(filter),
  queryFn: async () =>
    gqlClient.request(bulkAttendance, {
      filter,
    }),
});

export function getBulkAttendance(
  filter: Attendance_BulkAttendanceActionFilter
) {
  return queryClient.fetchQuery(bulkAttendanceQuery(filter));
}

export function useBulkAttendance(
  filter: Attendance_BulkAttendanceActionFilter
) {
  return useQuery({
    ...bulkAttendanceQuery(filter),
    select: ({ attendance_bulkAttendanceActions }) =>
      attendance_bulkAttendanceActions,
  });
}

export type ReturnTypeFromUseBulkAttendance = UseQueryReturnType<
  typeof useBulkAttendance
>[number];
