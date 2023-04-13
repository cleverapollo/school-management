import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const studentDashboardAssessments = graphql(/* GraphQL */ `
  query dashboardAssessment($filter: DashboardAssessmentFilter) {
    assessment_dashboardAssessment(filter: $filter) {
      id
      name
      description
      assessmentType
      startDate
      endDate
      results {
        id
        subject
        result
        grade
      }
    }
  }
`);

const studentDashboardAssessmentsQuery = (studentId: number | undefined) => ({
  queryKey: ['dashboard-assessment', studentId],
  queryFn: async () =>
    gqlClient.request(studentDashboardAssessments, {
      filter: { studentPartyId: studentId ?? 0 },
    }),
});

export function getStudentDashboardAssessments(studentId: number | undefined) {
  return queryClient.fetchQuery(studentDashboardAssessmentsQuery(studentId));
}

export function useStudentDashboardAssessments(studentId: number | undefined) {
  return useQuery({
    ...studentDashboardAssessmentsQuery(studentId),
    enabled: !!studentId,
    select: ({ assessment_dashboardAssessment }) =>
      assessment_dashboardAssessment,
  });
}
