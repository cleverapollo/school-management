import {
  AssessmentCommentFilter,
  AssessmentFilter,
  AssessmentResultFilter,
  CalculateGradeFilter,
  CommentBankFilter,
  DashboardAssessmentFilter,
  GradeSetFilter,
  OverallCommentsFilter,
  StudentResultFilter,
} from '@tyro/api';

export const assessmentsKeys = {
  all: ['assessments'] as const,
  assessments: (filter: AssessmentFilter) =>
    [...assessmentsKeys.all, filter] as const,
  assessmentsExtraFields: (filter: AssessmentFilter) =>
    [...assessmentsKeys.all, 'extraFields', filter] as const,
  resultsBySubjectGroup: (
    academicNamespaceId: number,
    filter: AssessmentResultFilter
  ) =>
    [...assessmentsKeys.all, 'results', academicNamespaceId, filter] as const,
  calculateGrade: (academicNamespaceId: number, filter: CalculateGradeFilter) =>
    [...assessmentsKeys.all, 'grade', academicNamespaceId, filter] as const,
  commentBanks: () => [...assessmentsKeys.all, 'commentBanks'] as const,
  commentBanksWithComments: (filter: CommentBankFilter) =>
    [...assessmentsKeys.commentBanks(), filter] as const,
  studentDashboardAssessments: (
    filter: DashboardAssessmentFilter,
    academicNamespaceId: number | string
  ) => [...assessmentsKeys.all, 'dashboard', academicNamespaceId, filter],
  assessmentResultsForStudent: (
    academicNamespaceId: number,
    filter: StudentResultFilter
  ) => [
    ...assessmentsKeys.all,
    'assessmentResultsForStudent',
    academicNamespaceId,
    filter,
  ],
  cbaGradeSets: (filter: GradeSetFilter) =>
    [...assessmentsKeys.all, 'cbaGradeSets', filter] as const,
  allAssessmentComments: () => [...assessmentsKeys.all, 'assessmentComments'],
  assessmentComments: (
    academicNamespaceId: number,
    filter: AssessmentCommentFilter
  ) => [
    ...assessmentsKeys.allAssessmentComments(),
    academicNamespaceId,
    filter,
  ],
  allOverallCommentsByYearGroup: () => [
    ...assessmentsKeys.all,
    'overallCommentsByYearGroup',
  ],
  overallCommentsByYearGroup: (
    academicNamespaceId: number,
    filter: OverallCommentsFilter
  ) => [
    ...assessmentsKeys.allOverallCommentsByYearGroup(),
    academicNamespaceId,
    filter,
  ],
};
