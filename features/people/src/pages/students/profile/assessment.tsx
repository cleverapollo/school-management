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
import {
  AssessmentType,
  useAcademicNamespace,
  usePermissions,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { AssessmentSelectBar } from '../../../components/students/assessments/assessment-select-bar';

export default function StudentProfileAssessmentPage() {
  const { id } = useParams();
  const studentId = useNumber(id);
  const { t } = useTranslation(['assessments']);
  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    null
  );
  const [selectedAssessment, setSelectedAssessment] = useState<
    ReturnTypeFromUseStudentDashboardAssessments[number] | null
  >(null);

  const { isStaffUser } = usePermissions();
  const { activeAcademicNamespace, isLoading: isNamespacesLoading } =
    useAcademicNamespace();
  const { data: studentAssessments = [], isLoading: isAssessmentsLoading } =
    useStudentDashboardAssessments(
      {
        studentPartyId: studentId ?? 0,
        published: !isStaffUser,
      },
      academicNameSpaceId,
      !!studentId
    );

  const filteredStudentAssessments = studentAssessments?.filter(
    (assessment) => assessment.assessmentType !== AssessmentType.StateCba
  );

  useEffect(() => {
    if (!academicNameSpaceId && activeAcademicNamespace) {
      setAcademicNameSpaceId(activeAcademicNamespace.academicNamespaceId);
    }
  }, [activeAcademicNamespace]);

  useEffect(() => {
    setSelectedAssessment(
      filteredStudentAssessments.length ? filteredStudentAssessments[0] : null
    );
  }, [studentAssessments]);

  const isLoading = isNamespacesLoading || isAssessmentsLoading;

  return (
    <StudentAssessmentReportCardSettingsProvider
      academicNamespaceId={academicNameSpaceId ?? 0}
      studentPartyId={studentId ?? 0}
      assessmentId={selectedAssessment?.id ?? 0}
    >
      <Stack direction="column" spacing={2}>
        <AssessmentSelectBar
          academicNameSpaceId={academicNameSpaceId}
          setAcademicNameSpaceId={setAcademicNameSpaceId}
          studentAssessments={filteredStudentAssessments}
          selectedAssessment={selectedAssessment}
          setSelectedAssessment={setSelectedAssessment}
        />
        {filteredStudentAssessments.length === 0 && !isLoading && (
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
        {selectedAssessment?.id && <StudentAssessmentReportCard />}
      </Stack>
    </StudentAssessmentReportCardSettingsProvider>
  );
}
