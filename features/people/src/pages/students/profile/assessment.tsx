import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';
import {
  ReturnTypeFromUseStudentDashboardAssessments,
  StudentAssessmentReportCard,
  StudentAssessmentReportCardSettingsProvider,
} from '@tyro/assessments';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useAcademicNamespace } from '@tyro/api';
import { AssessmentSelectBar } from '../../../components/students/assessments/assessment-select-bar';

export default function StudentProfileAssessmentPage() {
  const { id } = useParams();
  const studentId = useNumber(id);
  const [selectedAssessment, setSelectedAssessment] = useState<
    ReturnTypeFromUseStudentDashboardAssessments[number] | null
  >(null);

  const { activeAcademicNamespace } = useAcademicNamespace();

  return (
    <StudentAssessmentReportCardSettingsProvider>
      <Stack direction="column" spacing={2}>
        <AssessmentSelectBar
          studentId={studentId}
          selectedAssessment={selectedAssessment}
          setSelectedAssessment={setSelectedAssessment}
        />
        {selectedAssessment?.id && (
          <StudentAssessmentReportCard
            academicNamespaceId={
              activeAcademicNamespace?.academicNamespaceId ?? 0
            }
            studentPartyId={Number(studentId)}
            assessmentId={selectedAssessment?.id ?? 0}
            tableData={selectedAssessment ?? null}
          />
        )}
      </Stack>
    </StudentAssessmentReportCardSettingsProvider>
  );
}
