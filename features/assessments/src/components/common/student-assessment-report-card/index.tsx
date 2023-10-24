import { Box, Card } from '@mui/material';
import { LoadingPlaceholderContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useAssessmentExtraFieldsById } from '../../../api/assessments';
import { useStudentAssessmentResults } from '../../../api/term-assessments/student-results';
import { useStudentAssessmentReportCardSettings } from './settings';
import { ReportCardResultTable } from './results-table';

export * from './settings';

interface StudentAssessmentReportCardProps {
  academicNamespaceId: number;
  studentPartyId: number;
  assessmentId: number;
}

export function StudentAssessmentReportCard({
  academicNamespaceId,
  studentPartyId,
  assessmentId,
}: StudentAssessmentReportCardProps) {
  const { t } = useTranslation(['common']);
  const { tableContainerRef } = useStudentAssessmentReportCardSettings();
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
  const { data: extraFields, isLoading: isExtrafieldsLoading } =
    useAssessmentExtraFieldsById({
      academicNameSpaceId: academicNamespaceId,
      ids: [assessmentId],
    });

  const isLoading = isResultsLoading || isExtrafieldsLoading;

  return (
    <Card variant="soft">
      <Card ref={tableContainerRef} sx={{ minHeight: 300 }}>
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {studentResults?.length ? (
            <ReportCardResultTable
              results={studentResults}
              extraFields={extraFields ?? []}
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
    </Card>
  );
}
