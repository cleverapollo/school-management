import { Card, CardHeader, Typography, ButtonBase, Stack } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';
import { ReturnTypeFromUseOverallCommentsByYearGroup } from '../../api/overall-comment-year-group';
import { CommentStatusIcon } from './comment-status-icon';

interface StudentSelectorForOverallCommentsProps {
  yearGroupEnrollment:
    | NonNullable<
        ReturnTypeFromUseAssessmentById['yearGroupEnrolments']
      >[number]
    | undefined;
  students: ReturnTypeFromUseOverallCommentsByYearGroup['students'];
  selectedStudent:
    | ReturnTypeFromUseOverallCommentsByYearGroup['students'][number]
    | null;
  onSelectStudent: (
    student:
      | ReturnTypeFromUseOverallCommentsByYearGroup['students'][number]
      | null
  ) => void;
}

export function StudentSelectorForOverallComments({
  yearGroupEnrollment,
  students,
  selectedStudent,
  onSelectStudent,
}: StudentSelectorForOverallCommentsProps) {
  const [selectedElementRef, setSelectedElementRef] = useState<{
    key: number;
    element: HTMLButtonElement;
  } | null>(null);
  const { t } = useTranslation(['assessments', 'common']);
  const { displayName } = usePreferredNameLayout();
  const header = `${yearGroupEnrollment?.name ?? ''} (${students.length})`;

  useEffect(() => {
    if (selectedElementRef?.element) {
      selectedElementRef.element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [selectedElementRef?.key]);

  return (
    <Card
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: 216,
        position: 'absolute',
        height: '100%',
        minHeight: 'calc(100vh - 312px)',
      }}
    >
      <CardHeader component="h3" title={header} />
      <Stack overflow="scroll">
        {students.map((currentStudent) => {
          const { studentPartyId, student, commentStatus } = currentStudent;
          const isSelected = selectedStudent?.studentPartyId === studentPartyId;
          return (
            <ButtonBase
              ref={
                isSelected
                  ? (element) => {
                      if (
                        selectedElementRef?.key !== studentPartyId &&
                        element
                      ) {
                        setSelectedElementRef({
                          key: studentPartyId,
                          element,
                        });
                      }
                    }
                  : undefined
              }
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
