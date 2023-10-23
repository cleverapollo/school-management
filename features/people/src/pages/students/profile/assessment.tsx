import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';
import {
  ReturnTypeFromUseStudentDashboardAssessments,
  StudentAssessmentReportCard,
  StudentAssessmentReportCardSettingsProvider,
  useStudentDashboardAssessments,
} from '@tyro/assessments';
import { Box, Card, Stack } from '@mui/material';
import { useAcademicNamespace } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { AssessmentSelectBar } from '../../../components/students/assessments/assessment-select-bar';

export default function StudentProfileAssessmentPage() {
  const { id } = useParams();
  const studentId = useNumber(id);
  const { t } = useTranslation(['assessments']);
  const [selectedAssessment, setSelectedAssessment] = useState<
    ReturnTypeFromUseStudentDashboardAssessments[number] | null
  >(null);

  const { data: studentAssessments = [], isLoading } =
    useStudentDashboardAssessments(
      {
        studentPartyId: studentId ?? 0,
        published: true,
      },
      !!studentId
    );

  const { activeAcademicNamespace } = useAcademicNamespace();

  useEffect(() => {
    if (studentAssessments.length && !selectedAssessment) {
      setSelectedAssessment(studentAssessments[0]);
    }
  }, [studentAssessments]);

  return (
    <StudentAssessmentReportCardSettingsProvider>
      <Stack direction="column" spacing={2}>
        <AssessmentSelectBar
          studentAssessments={studentAssessments}
          selectedAssessment={selectedAssessment}
          setSelectedAssessment={setSelectedAssessment}
        />
        {studentAssessments.length === 0 && !isLoading && (
          <Card variant="soft">
            <Card sx={{ minHeight: 300 }}>
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
                {t('assessments:noAssessmentsAvailable')}
              </Box>
            </Card>
          </Card>
        )}
        {selectedAssessment?.id && (
          <StudentAssessmentReportCard
            academicNamespaceId={
              activeAcademicNamespace?.academicNamespaceId ?? 0
            }
            studentPartyId={Number(studentId)}
            assessmentId={selectedAssessment?.id ?? 0}
          />
        )}
      </Stack>
    </StudentAssessmentReportCardSettingsProvider>
  );
}
