import { StudyLevel } from '@tyro/api';
import { Fragment } from 'react';
import { ReturnTypeFromUseStudentAssessmentResults } from '../api/term-assessments/student-results';

export function getRowDetailsFromResult(
  result: ReturnTypeFromUseStudentAssessmentResults[number]
) {
  const { staff, subjects } = result.subjectGroup;
  const teacherNames =
    staff?.map(({ partyId, firstName, lastName }, index) => (
      <Fragment key={partyId}>
        <span key={partyId} style={{ whiteSpace: 'nowrap' }}>
          {firstName ? firstName[0] : ''}. {lastName ?? ''}
        </span>
        {index !== staff.length - 1 ? ', ' : ''}
      </Fragment>
    )) ?? '-';
  const subject = subjects.length > 0 ? subjects[0] : null;

  return {
    subject,
    teacherNames,
    result: result.result,
    grade: result.gradeResult,
    studyLevel: result.studentStudyLevel ?? StudyLevel.NotApplicable,
  };
}
