import { Button, Stack } from '@mui/material';
import {
  PageContainer,
  PageHeading,
  Select,
  useBreakpointValue,
  useNumber,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@tyro/icons';
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
import { StudentDropdownForOverallComments } from '../../components/overall-comments/student-dropdown';
import { OverallCommentsSummaryStats } from '../../components/overall-comments/summary-stats';

export default function OverallCommentsTermAssessmentPage() {
  const { academicNamespaceId, assessmentId } = useParams();
  const needToResetStudentAfterReset = useRef(true);
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const showSideMenu = useBreakpointValue({ base: false, md: true });
  const [selectedYearGroup, setSelectedYearGroup] =
    useState<
      NonNullable<
        ReturnTypeFromUseAssessmentById['yearGroupEnrolments']
      >[number]
    >();
  const [selectedStudent, setSelectedStudent] = useState<
    ReturnTypeFromUseOverallCommentsByYearGroup['students'][number] | null
  >(null);

  const { t } = useTranslation(['common', 'assessments']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: overallCommentsData } = useOverallCommentsByYearGroup(
    academicNameSpaceIdAsNumber ?? 0,
    {
      yearGroupEnrolmentId: selectedYearGroup?.yearGroupEnrollmentPartyId ?? 0,
      assessmentId: assessmentIdAsNumber ?? 0,
    },
    !!selectedYearGroup?.yearGroupEnrollmentPartyId
  );
  const { students: studentListForYearGroup, ...summaryStats } =
    overallCommentsData ?? { students: [] };

  const titleName = t('assessments:pageHeading.overallCommentsFor', {
    name: assessmentData?.name,
  });

  const onNextStudent = () => {
    if (selectedStudent && studentListForYearGroup) {
      const currentIndex = studentListForYearGroup.findIndex(
        (student) => student.studentPartyId === selectedStudent.studentPartyId
      );
      const nextStudent = studentListForYearGroup[currentIndex + 1];
      setSelectedStudent(nextStudent);
    }
  };

  const onPreviousStudent = () => {
    if (selectedStudent && studentListForYearGroup) {
      const currentIndex = studentListForYearGroup.findIndex(
        (student) => student.studentPartyId === selectedStudent.studentPartyId
      );
      const previousStudent = studentListForYearGroup[currentIndex - 1];
      setSelectedStudent(previousStudent);
    }
  };

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

  const firstStudent = studentListForYearGroup?.[0];
  const lastStudent =
    studentListForYearGroup?.[studentListForYearGroup.length - 1];

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

        <Stack direction="row" spacing={2} useFlexGap>
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
          {summaryStats && assessmentData && (
            <OverallCommentsSummaryStats
              yearSummaryStats={summaryStats}
              assessmentData={assessmentData}
            />
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={29}
          alignItems="flex-start"
          position="relative"
        >
          {showSideMenu && (
            <StudentSelectorForOverallComments
              yearGroupEnrollment={selectedYearGroup}
              students={studentListForYearGroup ?? []}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
            />
          )}
          <StudentAssessmentReportCard
            header={
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                pb={1}
                borderBottom="1px solid"
                borderColor="indigo.100"
                mx={0.5}
                mb={1.5}
              >
                <Button
                  variant="text"
                  disabled={
                    selectedStudent?.studentPartyId ===
                    firstStudent?.studentPartyId
                  }
                  onClick={onPreviousStudent}
                  startIcon={<ChevronLeftIcon />}
                >
                  {t('common:actions.previous')}
                </Button>
                {selectedStudent && (
                  <StudentDropdownForOverallComments
                    students={studentListForYearGroup ?? []}
                    selectedStudent={selectedStudent}
                    onSelectStudent={setSelectedStudent}
                  />
                )}
                <Button
                  variant="text"
                  disabled={
                    selectedStudent?.studentPartyId ===
                    lastStudent?.studentPartyId
                  }
                  onClick={onNextStudent}
                  endIcon={<ChevronRightIcon />}
                >
                  {t('common:actions.next')}
                </Button>
              </Stack>
            }
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
