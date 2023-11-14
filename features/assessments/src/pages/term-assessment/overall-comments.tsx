import { Button, Card, Stack, Typography } from '@mui/material';
import {
  PageContainer,
  PageHeading,
  Select,
  useBreakpointValue,
  useNumber,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@tyro/icons';
import { CommentStatus } from '@tyro/api';
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
import { CommentStatusIcon } from '../../components/overall-comments/comment-status-icon';

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
  const yearSummaryStats = useMemo(() => {
    const stats = {
      principalCommentsCompleted: 0,
      principalCommentsRequired: 0,
      yearHeadCommentsCompleted: 0,
      yearHeadCommentsRequired: 0,
      tutorCommentsCompleted: 0,
      tutorCommentsRequired: 0,
    };

    studentListForYearGroup.forEach((student) => {
      if (student.principalComment) {
        stats.principalCommentsRequired += 1;
        if (student.commentStatus === CommentStatus.Complete) {
          stats.principalCommentsCompleted += 1;
        }
      }
      if (student.yearHeadComment) {
        stats.yearHeadCommentsRequired += 1;
        if (student.commentStatus === CommentStatus.Complete) {
          stats.yearHeadCommentsCompleted += 1;
        }
      }
      if (student.tutorComment) {
        stats.tutorCommentsRequired += 1;
        if (student.commentStatus === CommentStatus.Complete) {
          stats.tutorCommentsCompleted += 1;
        }
      }
    });

    return stats;
  }, [studentListForYearGroup]);

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
          <Card
            variant="outlined"
            sx={{
              px: 1.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="slate.500">
              Summary
            </Typography>
            <Stack direction="row" spacing={3}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <CommentStatusIcon
                  size="small"
                  commentStatus={
                    yearSummaryStats.principalCommentsCompleted ===
                    yearSummaryStats.principalCommentsRequired
                      ? CommentStatus.Complete
                      : CommentStatus.NotStarted
                  }
                />
                <Typography variant="body2">
                  {yearSummaryStats.principalCommentsCompleted}/
                  {yearSummaryStats.principalCommentsRequired} Principal
                  comments
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <CommentStatusIcon
                  size="small"
                  commentStatus={
                    yearSummaryStats.yearHeadCommentsCompleted ===
                    yearSummaryStats.yearHeadCommentsRequired
                      ? CommentStatus.Complete
                      : CommentStatus.NotStarted
                  }
                />
                <Typography variant="body2">
                  {yearSummaryStats.yearHeadCommentsCompleted}/
                  {yearSummaryStats.yearHeadCommentsRequired} Year head comments
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <CommentStatusIcon
                  size="small"
                  commentStatus={
                    yearSummaryStats.tutorCommentsCompleted ===
                    yearSummaryStats.tutorCommentsRequired
                      ? CommentStatus.Complete
                      : CommentStatus.NotStarted
                  }
                />
                <Typography variant="body2">
                  {yearSummaryStats.tutorCommentsCompleted}/
                  {yearSummaryStats.tutorCommentsRequired} Tutor comments
                </Typography>
              </Stack>
            </Stack>
          </Card>
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
                    yearGroupEnrollment={selectedYearGroup}
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
