import { useQuery } from '@tanstack/react-query';
import {
  DashboardAssessmentFilter,
  EmulateHeaders,
  getAcademicNamespace,
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
  filter: DashboardAssessmentFilter,
  academicNamespaceId?: number | null
) => ({
  queryKey: assessmentsKeys.studentDashboardAssessments(
    filter,
    academicNamespaceId ?? 'activeNamespace'
  ),
  queryFn: async () => {
    let fufilledAcademicNamespaceId = academicNamespaceId;

    if (!fufilledAcademicNamespaceId) {
      const { activeAcademicNamespace } = await getAcademicNamespace();
      fufilledAcademicNamespaceId =
        activeAcademicNamespace?.academicNamespaceId ?? 0;
    }

    const { assessment_dashboardAssessment: assessmentDashboardAssessment } =
      await gqlClient.request(
        studentDashboardAssessments,
        {
          filter,
        },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
            fufilledAcademicNamespaceId.toString(),
        }
      );

    return assessmentDashboardAssessment?.sort(
      (a, b) => dayjs(b.startDate).unix() - dayjs(a.startDate).unix()
    );
  },
});

export function getStudentDashboardAssessments(
  filter: DashboardAssessmentFilter,
  academicNamespaceId?: number | null
) {
  return queryClient.fetchQuery(
    studentDashboardAssessmentsQuery(filter, academicNamespaceId)
  );
}

export function useStudentDashboardAssessments(
  filter: DashboardAssessmentFilter,
  academicNamespaceId?: number | null,
  enabled = true
) {
  return useQuery({
    ...studentDashboardAssessmentsQuery(filter, academicNamespaceId),
    enabled,
  });
}

export type ReturnTypeFromUseStudentDashboardAssessments = UseQueryReturnType<
  typeof useStudentDashboardAssessments
>;
