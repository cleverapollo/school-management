import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { LoadingPlaceholderContainer, TableStudyLevelChip } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { StudyLevel } from '@tyro/api';
import { ReturnTypeFromUseStudentDashboardAssessments } from '../../../api/student-dashboard-assessment';
import { useStudentAssessmentResults } from '../../../api/term-assessments/student-results';
import { useStudentAssessmentReportCardSettings } from './settings';

export * from './settings';

interface StudentAssessmentReportCardProps {
  academicNamespaceId: number;
  studentPartyId: number;
  assessmentId: number;
  tableData: ReturnTypeFromUseStudentDashboardAssessments[number] | null;
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
  tableData,
}: StudentAssessmentReportCardProps) {
  const { t } = useTranslation(['common']);
  const { tableContainerRef } = useStudentAssessmentReportCardSettings();
  const { data: studentResults, isLoading } = useStudentAssessmentResults(
    academicNamespaceId,
    academicNamespaceId && studentPartyId && assessmentId
      ? {
          studentPartyIds: [studentPartyId],
          assessmentIds: [assessmentId],
        }
      : null
  );

  return (
    <Card sx={{ backgroundColor: 'slate.50', p: 1.5, borderRadius: 3.5 }}>
      <Card ref={tableContainerRef} sx={{ minHeight: 300 }}>
        <LoadingPlaceholderContainer isLoading={false}>
          {tableData?.results?.length ? (
            <TableContainer>
              <Table
                size="small"
                sx={({ palette }) => ({
                  '& th': {
                    background: 'transparent',
                    color: 'text.secondary',
                    fontWeight: 600,
                    borderTop: 'none',
                  },
                  '& th, & td': {
                    border: `1px solid ${palette.divider}`,
                    px: 2,
                    py: 1.25,
                  },
                  '& th:first-of-type, & td:first-of-type': {
                    borderLeft: 'none',
                  },
                  '& th:last-of-type, & td:last-of-type': {
                    borderRight: 'none',
                  },
                  '& th:nth-of-type(2), & td:nth-of-type(2), & th:nth-of-type(3), & td:nth-of-type(3), & th:nth-of-type(4), & td:nth-of-type(4)':
                    {
                      textAlign: 'center',
                      width: 100,
                    },
                  '& tbody td': {
                    verticalAlign: 'baseline',
                  },
                })}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common:subject')}</TableCell>
                    <TableCell>{t('common:level')}</TableCell>
                    <TableCell>{t('common:result')}</TableCell>
                    <TableCell>{t('common:grade')}</TableCell>
                    <TableCell>{t('common:teacher')}</TableCell>
                    <TableCell>{t('common:comment')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.results?.map((result) => (
                    <TableRow key={result?.id}>
                      <TableCell>{result?.subject ?? '-'}</TableCell>
                      <TableCell>
                        <TableStudyLevelChip
                          level={result?.studyLevel ?? StudyLevel.NotApplicable}
                          condensed
                        />
                      </TableCell>
                      <TableCell>
                        {typeof result?.result === 'number'
                          ? `${result?.result}%`
                          : '-'}
                      </TableCell>
                      <TableCell>{result?.grade ?? '-'}</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyResultsMessage />
          )}
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
