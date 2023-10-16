import {
  AwolFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { reportsKeys } from './keys';

const awolReportsList = graphql(/* GraphQL */ `
  query attendance_awolReport($filter: AwolFilter!) {
    attendance_awolReport(filter: $filter) {
      awolStudents {
        partyId
        date
        student {
          person {
            avatarUrl
            firstName
            lastName
          }
        }
        classGroup {
          name
        }
        absentSubjectGroup {
          name
        }
        absentEvent {
          eventId
          startTime
          endTime
          name
          description
        }
        absentMarkedBy {
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
        }
        presentSubjectGroup {
          partyId
          subjectGroupType
          name
        }
        presentMarkedBy {
          type
          firstName
        }
      }
    }
  }
`);

const awolReportsQuery = (filter: AwolFilter) => ({
  queryKey: reportsKeys.awolReport(filter),
  queryFn: async () => gqlClient.request(awolReportsList, { filter }),
});

export function getAwolReportsQuery(filter: AwolFilter) {
  return queryClient.fetchQuery(awolReportsQuery(filter));
}

export function useAwolReports(filter: AwolFilter) {
  return useQuery({
    ...awolReportsQuery(filter),
    select: ({ attendance_awolReport }) => attendance_awolReport?.awolStudents,
  });
}

export type ReturnTypeFromUseAwolReports = UseQueryReturnType<
  typeof useAwolReports
>[number];
