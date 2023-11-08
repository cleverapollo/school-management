import { Card, CardHeader, Typography, ButtonBase, Stack } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';
import { ReturnTypeFromUseOverallCommentsByYearGroup } from '../../api/overall-comment-year-group';
import { CommentStatusIcon } from './comment-status-icon';

interface StudentSelectorForOverallCommentsProps {
  yearGroupEnrollment:
    | NonNullable<
        ReturnTypeFromUseAssessmentById['yearGroupEnrolments']
      >[number]
    | undefined;
  students: ReturnTypeFromUseOverallCommentsByYearGroup[];
  selectedStudent: ReturnTypeFromUseOverallCommentsByYearGroup | null;
  onSelectStudent: (
    student: ReturnTypeFromUseOverallCommentsByYearGroup | null
  ) => void;
}

export function StudentSelectorForOverallComments({
  yearGroupEnrollment,
  students,
  selectedStudent,
  onSelectStudent,
}: StudentSelectorForOverallCommentsProps) {
  const { t } = useTranslation(['assessments', 'common']);
  const { displayName } = usePreferredNameLayout();
  const header = `${yearGroupEnrollment?.name ?? ''} (${students.length})`;

  return (
    <Card
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 216,
      }}
    >
      <CardHeader component="h3" title={header} />
      <Stack flex="1 1 0">
        {students.map((currentStudent) => {
          const { studentPartyId, student, commentStatus } = currentStudent;
          return (
            <ButtonBase
              key={studentPartyId}
              onClick={() => onSelectStudent(currentStudent)}
              sx={{
                justifyContent: 'space-between',
                p: 1,
                m: 1,
                backgroundColor:
                  selectedStudent?.studentPartyId === studentPartyId
                    ? 'indigo.50'
                    : 'transparent',
                borderRadius: 1,
              }}
            >
              <Stack justifyContent="flex-start" textAlign="left">
                <Typography variant="subtitle2">
                  {displayName(student.person)}
                </Typography>
                <Typography variant="body2">
                  {t(`assessments:commentStatus.${commentStatus}`)}
                </Typography>
              </Stack>
              <CommentStatusIcon commentStatus={commentStatus} />
            </ButtonBase>
          );
        })}
      </Stack>
    </Card>
  );
}
