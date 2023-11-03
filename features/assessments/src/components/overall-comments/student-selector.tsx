import { Card, CardHeader, Typography, ButtonBase } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';
import { ReturnTypeFromUseOverallCommentsByYearGroup } from '../../api/overall-comment-year-group';

interface StudentSelectorForOverallCommentsProps {
  yearGroup:
    | NonNullable<ReturnTypeFromUseAssessmentById['years']>[number]
    | undefined;
  students: ReturnTypeFromUseOverallCommentsByYearGroup[];
}

export function StudentSelectorForOverallComments({
  yearGroup,
  students,
}: StudentSelectorForOverallCommentsProps) {
  const { displayName } = usePreferredNameLayout();
  const header = `${yearGroup?.name ?? ''} (${students.length})`;

  return (
    <Card
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 216 }}
    >
      <CardHeader component="h3" title={header} />
      {students.map(({ studentPartyId, student }) => (
        <ButtonBase
          key={studentPartyId}
          onClick={() => {}}
          TouchRippleProps={{}}
          color="primary"
        >
          <Typography sx={{ p: 2 }}>{displayName(student.person)}</Typography>
        </ButtonBase>
      ))}
    </Card>
  );
}
