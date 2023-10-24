import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { assessmentsKeys } from './keys';

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
        studyLevel
      }
    }
  }
`);

const studentDashboardAssessmentsQuery = (studentId: number | undefined) => ({
  queryKey: assessmentsKeys.studentAssessments(studentId ?? 0),
  queryFn: async () =>
    gqlClient.request(studentDashboardAssessments, {
      filter: { studentPartyId: studentId ?? 0, published: true },
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
