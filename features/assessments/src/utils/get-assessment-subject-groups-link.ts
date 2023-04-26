import { Assessment, AssessmentType } from '@tyro/api';

export function getAssessmentSubjectGroupsLink(
  assessmentId: Assessment['id'],
  assessmentType: AssessmentType,
  academicNameSpaceId: number
) {
  switch (assessmentType) {
    case AssessmentType.Term:
      return `./${academicNameSpaceId}/term-assessments/${assessmentId}`;
    case AssessmentType.InClass:
      return `./${academicNameSpaceId}/class-assessments/${assessmentId}`;
    case AssessmentType.StateCba:
      return `./${academicNameSpaceId}/state-cba-assessments/${assessmentId}`;
    default:
      return '';
  }
}
