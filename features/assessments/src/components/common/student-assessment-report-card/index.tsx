import { Box, Card, CardProps, Stack } from '@mui/material';
import { LoadingPlaceholderContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useAssessmentById } from '../../../api/assessments';
import { useStudentAssessmentResults } from '../../../api/term-assessments/student-results';
import { useStudentAssessmentReportCardSettings } from './settings';
import { ReportCardResultTable } from './results-table';
import { OverallComments } from './overall-comments';
import { useAssessmentComments } from '../../../api/term-assessments/assessment-comments';

export * from './settings';

interface StudentAssessmentReportCardProps {
  containerProps?: CardProps;
  header?: React.ReactNode;
}

export function StudentAssessmentReportCard({
  containerProps,
  header,
}: StudentAssessmentReportCardProps) {
  const { t } = useTranslation(['common']);
  const {
    tableContainerRef,
    academicNamespaceId,
    studentPartyId,
    assessmentId,
  } = useStudentAssessmentReportCardSettings();
  const { data: assessmentData, isLoading: isAssessmentLoading } =
    useAssessmentById({
      academicNameSpaceId: academicNamespaceId,
      ids: [assessmentId],
    });
  const { data: assessmentComments } = useAssessmentComments(
    academicNamespaceId,
    {
      assessmentId,
      studentPartyId,
    }
  );
  const { data: studentResults, isLoading: isResultsLoading } =
    useStudentAssessmentResults(
      academicNamespaceId,
      academicNamespaceId && studentPartyId && assessmentId
        ? {
            studentPartyIds: [studentPartyId],
            assessmentId,
          }
        : null
    );

  const isLoading = isResultsLoading || isAssessmentLoading;

  return (
    <Card variant="soft" {...containerProps}>
      {header}
      <Stack spacing={2}>
        <Card ref={tableContainerRef} sx={{ minHeight: 300 }}>
          <LoadingPlaceholderContainer isLoading={isLoading}>
            {studentResults?.length ? (
              <ReportCardResultTable
                results={studentResults}
                extraFields={assessmentData?.extraFields ?? []}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                }}
              >
                {t('common:noResultsFound')}
              </Box>
            )}
          </LoadingPlaceholderContainer>
        </Card>
        {!isLoading && assessmentData && assessmentComments && (
          <OverallComments
            assessmentData={assessmentData}
            assessmentComments={assessmentComments}
          />
        )}
      </Stack>
    </Card>
  );
}
