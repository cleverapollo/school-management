import { useQuery } from '@tanstack/react-query';
import {
  DashboardAssessmentFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import dayjs from 'dayjs';
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

const studentDashboardAssessmentsQuery = (
  filter: DashboardAssessmentFilter
) => ({
  queryKey: assessmentsKeys.studentDashboardAssessments(filter),
  queryFn: async () => {
    const { assessment_dashboardAssessment: assessmentDashboardAssessment } =
      await gqlClient.request(studentDashboardAssessments, {
        filter,
      });

    return assessmentDashboardAssessment?.sort(
      (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix()
    );
  },
});

export function getStudentDashboardAssessments(
  filter: DashboardAssessmentFilter
) {
  return queryClient.fetchQuery(studentDashboardAssessmentsQuery(filter));
}

export function useStudentDashboardAssessments(
  filter: DashboardAssessmentFilter,
  enabled = true
) {
  return useQuery({
    ...studentDashboardAssessmentsQuery(filter),
    enabled,
  });
}

export type ReturnTypeFromUseStudentDashboardAssessments = UseQueryReturnType<
  typeof useStudentDashboardAssessments
>;
