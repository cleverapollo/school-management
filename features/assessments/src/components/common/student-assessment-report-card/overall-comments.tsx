import { Card, Stack } from '@mui/material';
import { CommenterUserType } from '@tyro/api';
import { ReturnTypeFromUseAssessmentComments } from '../../../api/term-assessments/assessment-comments';
import { ReturnTypeFromUseAssessmentById } from '../../../api/assessments';
import { OverallComment } from './overall-comment';
import { useStudentAssessmentReportCardSettings } from './settings';

interface OverallCommentsProps {
  assessmentData: ReturnTypeFromUseAssessmentById;
  assessmentComments: ReturnTypeFromUseAssessmentComments;
}

export function OverallComments({
  assessmentData,
  assessmentComments,
}: OverallCommentsProps) {
  const { editableComments } = useStudentAssessmentReportCardSettings();

  const {
    capturePrincipalComment,
    captureYearHeadComment,
    captureTutorComment,
    captureHouseMasterComment,
  } = assessmentData;

  if (
    !capturePrincipalComment &&
    !captureYearHeadComment &&
    !captureTutorComment &&
    !captureHouseMasterComment
  )
    return null;

  const principalComment = assessmentComments?.get(CommenterUserType.Principal);
  const yearHeadComment = assessmentComments?.get(CommenterUserType.YearHead);
  const tutorComment = assessmentComments?.get(CommenterUserType.Tutor);
  const houseMasterComment = assessmentComments?.get(
    CommenterUserType.HouseMaster
  );

  return (
    <Card>
      <Stack direction="row" flexWrap="wrap" component="dl" m={0}>
        {capturePrincipalComment && (
          <OverallComment
            commentId={principalComment?.id}
            commenterUserType={CommenterUserType.Principal}
            comment={principalComment?.comment}
            value={
              principalComment?.commentBankCommentId ??
              principalComment?.comment
            }
            canEdit={!!editableComments?.principalComment}
            commentType={assessmentData.principalCommentType}
            commentBank={assessmentData.principalCommentBank}
            commentLength={assessmentData.principalCommentLength}
          />
        )}
        {captureYearHeadComment && (
          <OverallComment
            commentId={yearHeadComment?.id}
            commenterUserType={CommenterUserType.YearHead}
            comment={yearHeadComment?.comment}
            value={
              yearHeadComment?.commentBankCommentId ?? yearHeadComment?.comment
            }
            canEdit={!!editableComments?.yearHeadComment}
            commentType={assessmentData.yearHeadCommentType}
            commentBank={assessmentData.yearHeadCommentBank}
            commentLength={assessmentData.yearHeadCommentLength}
          />
        )}
        {captureTutorComment && (
          <OverallComment
            commentId={tutorComment?.id}
            commenterUserType={CommenterUserType.Tutor}
            comment={tutorComment?.comment}
            value={tutorComment?.commentBankCommentId ?? tutorComment?.comment}
            canEdit={!!editableComments?.tutorComment}
            commentType={assessmentData.tutorCommentType}
            commentBank={assessmentData.tutorCommentBank}
            commentLength={assessmentData.tutorCommentLength}
          />
        )}
        {captureHouseMasterComment && (
          <OverallComment
            commentId={houseMasterComment?.id}
            commenterUserType={CommenterUserType.HouseMaster}
            comment={houseMasterComment?.comment}
            value={
              houseMasterComment?.commentBankCommentId ??
              houseMasterComment?.comment
            }
            canEdit={!!editableComments?.houseMasterComment}
            commentType={assessmentData.housemasterCommentType}
            commentBank={assessmentData.housemasterCommentBank}
            commentLength={assessmentData.housemasterCommentLength}
          />
        )}
      </Stack>
    </Card>
  );
}
