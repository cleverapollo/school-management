import { Assessment, AssessmentType } from '@tyro/api';

export const assessmentUrlPathBasedOnType = {
  [AssessmentType.Term]: 'term-assessments',
  [AssessmentType.InClass]: 'class-assessments',
  [AssessmentType.StateCba]: 'state-cba-assessments',
};

export function getAssessmentSubjectGroupsLink(
  assessmentId: Assessment['id'],
  assessmentType: AssessmentType,
  academicNameSpaceId: number
) {
  const assessmentTypePath = assessmentUrlPathBasedOnType[assessmentType];
  return `./${academicNameSpaceId}/${assessmentTypePath}/${assessmentId}`;
}
