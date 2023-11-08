import { Stack } from '@mui/material';
import { PageContainer, PageHeading, Select, useNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReturnTypeFromUseAssessmentById,
  useAssessmentById,
} from '../../api/assessments';
import { StudentSelectorForOverallComments } from '../../components/overall-comments/student-selector';
import {
  ReturnTypeFromUseOverallCommentsByYearGroup,
  useOverallCommentsByYearGroup,
} from '../../api/overall-comment-year-group';
import {
  StudentAssessmentReportCard,
  StudentAssessmentReportCardSettingsProvider,
} from '../../components/common/student-assessment-report-card';

export default function OverallCommentsTermAssessmentPage() {
  const { academicNamespaceId, assessmentId } = useParams();
  const needToResetStudentAfterReset = useRef(true);
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const [selectedYearGroup, setSelectedYearGroup] =
    useState<
      NonNullable<
        ReturnTypeFromUseAssessmentById['yearGroupEnrolments']
      >[number]
    >();
  const [selectedStudent, setSelectedStudent] =
    useState<ReturnTypeFromUseOverallCommentsByYearGroup | null>(null);

  const { t } = useTranslation(['common', 'assessments']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: studentListForYearGroup = [] } = useOverallCommentsByYearGroup(
    academicNameSpaceIdAsNumber ?? 0,
    {
      yearGroupEnrolmentId: selectedYearGroup?.yearGroupEnrollmentPartyId ?? 0,
      assessmentId: assessmentIdAsNumber ?? 0,
    },
    !!selectedYearGroup?.yearGroupEnrollmentPartyId
  );

  const titleName = t('assessments:pageHeading.overallCommentsFor', {
    name: assessmentData?.name,
  });

  useEffect(() => {
    if (!selectedYearGroup && assessmentData?.yearGroupEnrolments?.length) {
      setSelectedYearGroup(assessmentData.yearGroupEnrolments[0]);
    }
  }, [assessmentData?.years]);

  useEffect(() => {
    if (
      needToResetStudentAfterReset.current &&
      studentListForYearGroup?.length > 0
    ) {
      needToResetStudentAfterReset.current = false;
      setSelectedStudent(studentListForYearGroup[0]);
    }
  }, [studentListForYearGroup]);

  return (
    <StudentAssessmentReportCardSettingsProvider
      academicNamespaceId={academicNameSpaceIdAsNumber ?? 0}
      studentPartyId={selectedStudent?.studentPartyId ?? 0}
      assessmentId={assessmentIdAsNumber ?? 0}
      editableComments={{
        principalComment: !!selectedStudent?.principalComment,
        yearHeadComment: !!selectedStudent?.yearHeadComment,
        tutorComment: !!selectedStudent?.tutorComment,
      }}
    >
      <PageContainer title={titleName}>
        <PageHeading
          title={titleName}
          breadcrumbs={{
            links: [
              {
                name: t('assessments:pageHeading.assessments'),
                href: '/assessments',
              },
              {
                name: titleName,
              },
            ],
          }}
        />

        <Stack direction="row">
          <Select
            label={t('common:year')}
            variant="white-filled"
            value={selectedYearGroup?.yearGroupEnrollmentPartyId ?? ''}
            onChange={(event) => {
              needToResetStudentAfterReset.current = true;
              const yearGroupEnrollmentPartyId = Number(event.target.value);
              const yearGroupEnrollment =
                assessmentData?.yearGroupEnrolments?.find(
                  (year) =>
                    year.yearGroupEnrollmentPartyId ===
                    yearGroupEnrollmentPartyId
                );
              setSelectedYearGroup(yearGroupEnrollment);
            }}
            optionIdKey="yearGroupEnrollmentPartyId"
            optionTextKey="name"
            options={assessmentData?.yearGroupEnrolments ?? []}
            sx={{ maxWidth: 216, flex: 1 }}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={29}
          alignItems="flex-start"
          position="relative"
        >
          <StudentSelectorForOverallComments
            yearGroupEnrollment={selectedYearGroup}
            students={studentListForYearGroup ?? []}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
          />
          <StudentAssessmentReportCard
            containerProps={{
              sx: {
                flex: 1,
              },
            }}
          />
        </Stack>
      </PageContainer>
    </StudentAssessmentReportCardSettingsProvider>
  );
}
