import { Box, Card } from '@mui/material';
import { LoadingPlaceholderContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStudentAssessmentResults } from '../../../api/term-assessments/student-results';
import { useStudentAssessmentReportCardSettings } from './settings';
import { ReportCardResultTable } from './results-table';

export * from './settings';

interface StudentAssessmentReportCardProps {
  academicNamespaceId: number;
  studentPartyId: number;
  assessmentId: number;
}

const EmptyResultsMessage = () => {
  const { t } = useTranslation(['common']);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      {t('common:noResultsFound')}
    </Box>
  );
};

export function StudentAssessmentReportCard({
  academicNamespaceId,
  studentPartyId,
  assessmentId,
}: StudentAssessmentReportCardProps) {
  const { tableContainerRef } = useStudentAssessmentReportCardSettings();
  const { data: studentResults, isLoading } = useStudentAssessmentResults(
    academicNamespaceId,
    academicNamespaceId && studentPartyId && assessmentId
      ? {
          studentPartyIds: [studentPartyId],
          assessmentId,
        }
      : null
  );

  return (
    <Card sx={{ backgroundColor: 'slate.50', p: 1.5, borderRadius: 3.5 }}>
      <Card ref={tableContainerRef} sx={{ minHeight: 300 }}>
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {studentResults?.length ? (
            <ReportCardResultTable results={studentResults} />
          ) : (
            <EmptyResultsMessage />
          )}
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
