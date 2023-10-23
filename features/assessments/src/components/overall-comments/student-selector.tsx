import { Card, CardHeader, Typography, ButtonBase } from '@mui/material';
import { ReturnTypeFromUseYearGroupById } from '@tyro/groups';
import { usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';

interface StudentSelectorForOverallCommentsProps {
  yearGroup:
    | NonNullable<ReturnTypeFromUseAssessmentById['years']>[number]
    | undefined;
  students: ReturnTypeFromUseYearGroupById['students'];
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
      {students.map((student) => (
        <ButtonBase
          key={student.partyId}
          onClick={() => {}}
          TouchRippleProps={{}}
          color="primary"
        >
          <Typography key={student.partyId} sx={{ p: 2 }}>
            {displayName(student.person)}
          </Typography>
        </ButtonBase>
      ))}
    </Card>
  );
}
