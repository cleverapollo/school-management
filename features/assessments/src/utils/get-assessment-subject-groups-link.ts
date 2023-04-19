import { Assessment, AssessmentType } from '@tyro/api';

export function getAssessmentSubjectGroupsLink(
  assessmentId: Assessment['id'],
  assessmentType: AssessmentType
) {
  switch (assessmentType) {
    case AssessmentType.Term:
      return `./term-assessments/${assessmentId}`;
    case AssessmentType.InClass:
      return `./class-assessments/${assessmentId}`;
    case AssessmentType.StateCba:
      return `./state-cba-assessments/${assessmentId}`;
    default:
      return '';
  }
}
