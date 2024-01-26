import {
  AwolFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { reportsKeys } from './keys';

const attendanceAwolReports = graphql(/* GraphQL */ `
  query attendance_awolReport($filter: AwolFilter!) {
    attendance_awolReport(filter: $filter) {
      date
      partyId
      student {
        partyId
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
        yearGroups {
          name
        }
      }
      classGroupId
      classGroup {
        partyId
        name
      }
      absentEvent {
        eventId
        startTime
        endTime
        name
        description
        rooms {
          name
        }
      }
      absentSubjectGroup {
        partyId
        subjectGroupType
        name
        subjects {
          colour
        }
      }
      absentUpdatedBy {
        firstName
        lastName
        avatarUrl
      }
      absentCreatedBy {
        firstName
        lastName
        avatarUrl
      }
      presentEvent {
        eventId
        allDayEvent
        startTime
        endTime
        name
        rooms {
          name
        }
      }
      presentSubjectGroup {
        partyId
        subjectGroupType
        name
        subjects {
          colour
        }
      }
      presentUpdatedBy {
        avatarUrl
        firstName
        lastName
      }
      presentCreatedBy {
        avatarUrl
        firstName
        lastName
      }
    }
  }
`);

const attendanceAwolReportsQuery = (filter: AwolFilter) => ({
  queryKey: reportsKeys.awolReport(filter),
  staleTime: 0,
  queryFn: async () => gqlClient.request(attendanceAwolReports, { filter }),
});

export function getAwolReportsQuery(filter: AwolFilter) {
  return queryClient.fetchQuery(attendanceAwolReportsQuery(filter));
}

export function useAttendanceAwolReports(filter: AwolFilter) {
  return useQuery({
    ...attendanceAwolReportsQuery(filter),
    select: ({ attendance_awolReport }) => attendance_awolReport,
  });
}

export type ReturnTypeFromUseAttendanceAwolReports = UseQueryReturnType<
  typeof useAttendanceAwolReports
>[number];
