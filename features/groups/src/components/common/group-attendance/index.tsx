import {
  Card,
  Fade,
  Stack,
  Typography,
  Skeleton,
  Box,
  Table,
  TableCell,
  TableHead,
  Slide,
  AlertTitle,
  Alert,
  TableRow,
  TableBody,
  IconButton,
  Button,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import LoadingButton from '@mui/lab/LoadingButton';

import { AttendanceToggle } from '@tyro/attendance';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ThumbsUpCheckmarkIcon,
  SaveIcon,
  UndoIcon,
} from '@tyro/icons';
import { usePreferredNameLayout } from '@tyro/core';
import { useEffect, useState } from 'react';
import { StudentAvatar } from '@tyro/people';
import { AttendanceCodeType } from '@tyro/api';
import { useHandleLessonAttendance, GroupStudent } from '../../../hooks';
import { AdditionalLessonsModal } from './additional-lessons-modal';

type AttendanceProps = {
  partyId: number;
  eventStartTime?: string | null;
  students: GroupStudent[];
};

const previousAttendanceCodeColor = {
  [AttendanceCodeType.Present]: 'text.secondary',
  [AttendanceCodeType.ExplainedAbsence]: 'pink.600',
  [AttendanceCodeType.UnexplainedAbsence]: 'pink.600',
  [AttendanceCodeType.Late]: 'sky.600',
  [AttendanceCodeType.NotTaken]: 'text.secondary',
} as const;

export const GroupAttendance = ({
  partyId,
  eventStartTime,
  students,
}: AttendanceProps) => {
  const { t } = useTranslation(['common', 'groups', 'attendance']);
  const { displayName } = usePreferredNameLayout();

  const {
    lessonId,
    isEditing,
    isLessonLoading,
    isEmptyLesson,
    formattedLessonDate,
    isSaveAttendanceLoading,
    eventsOnSameDayForSameGroup,
    nextLesson,
    previousLesson,
    getStudentEventDetails,
    getStudentAttendanceCode,
    setStudentAttendanceCode,
    saveAttendance,
    cancelAttendance,
  } = useHandleLessonAttendance({
    partyId,
    eventStartTime,
    students,
  });

  const [showAlertSuccess, setAlertSuccess] = useState(false);
  const [showAdditionalLessonsModal, setShowAdditionalLessonsModal] =
    useState(false);

  useEffect(() => {
    setAlertSuccess(false);
  }, [lessonId]);

  const handleSaveAttendance = () => {
    if (eventsOnSameDayForSameGroup.length > 0) {
      setShowAdditionalLessonsModal(true);
    } else {
      saveAttendance({
        additionalLessonIds: [],
        onSuccess: () => setAlertSuccess(true),
      });
    }
  };

  const handleSaveAdditionalLessons = (additionalLessonIds: number[]) => {
    saveAttendance({
      additionalLessonIds,
      onSuccess: () => {
        setShowAdditionalLessonsModal(false);
        setAlertSuccess(true);
      },
    });
  };

  const isLoading = isLessonLoading || isSaveAttendanceLoading;
  const showStudentsTable = !isLessonLoading && !isEmptyLesson;

  return (
    <>
      <Card
        key={lessonId}
        variant="outlined"
        sx={{ width: '100%', maxWidth: '540px', overflow: 'visible' }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            borderTop: '0',
            borderLeft: '0',
            borderRight: '0',
            borderBottom: '1px',
            borderStyle: 'solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            size="small"
            color="primary"
            disabled={isLoading}
            onClick={previousLesson}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Box sx={{ flex: 1, overflowX: 'hidden', textAlign: 'center' }}>
            {isLessonLoading ? (
              <Skeleton
                variant="text"
                height="26px"
                width="220px"
                sx={{ margin: '0 auto' }}
              />
            ) : (
              <Typography
                component="h4"
                variant="subtitle2"
                noWrap
                sx={{ px: 2, textOverflow: 'ellipsis' }}
              >
                {formattedLessonDate}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            color="primary"
            disabled={isLoading}
            onClick={nextLesson}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        {isEmptyLesson && (
          <Stack justifyContent="center" alignItems="center" minHeight={300}>
            <Typography variant="h6" component="span">
              {t('groups:lessonAttendanceNotFound')}
            </Typography>
          </Stack>
        )}
        {showStudentsTable && (
          <>
            <Table
              size="small"
              sx={{
                '& th': {
                  background: 'transparent',
                  color: 'text.primary',
                  fontWeight: 600,
                },
                '& th:first-of-type': {
                  width: '100%',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>{t('groups:students')}</TableCell>
                  <TableCell>{t('groups:status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  const eventDetails = getStudentEventDetails(student.partyId);
                  const submittedBy = displayName(eventDetails?.createdBy);
                  // const previousLessonCode =
                  //   eventDetails?.previousLessonAttendanceCode?.codeType ??
                  //   AttendanceCodeType.NotTaken;

                  return (
                    <TableRow key={student?.partyId}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <StudentAvatar
                            partyId={student?.partyId}
                            name={displayName(student?.person)}
                            isPriorityStudent={!!student?.extensions?.priority}
                            hasSupportPlan={false}
                            src={student?.person?.avatarUrl}
                          />
                          <Stack direction="column">
                            <Typography variant="body2" fontWeight={600}>
                              {displayName(student?.person)}
                            </Typography>
                            {/* <Typography
                              variant="body2"
                              color={
                                previousAttendanceCodeColor[previousLessonCode]
                              }
                            >
                              {previousLessonCode ===
                              AttendanceCodeType.NotTaken
                                ? '-'
                                : t(
                                    `attendance:previousAttendanceCode.${previousLessonCode}`
                                  )}
                            </Typography> */}
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {eventDetails && eventDetails.adminSubmitted ? (
                          <Stack direction="column">
                            <Typography variant="caption" fontWeight={600}>
                              {eventDetails.attendanceCode.name}
                            </Typography>
                            {eventDetails.note && (
                              <Typography component="span" variant="caption">
                                {eventDetails.note}
                              </Typography>
                            )}
                            {submittedBy && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {`${t('common:submittedBy')} ${submittedBy}`}
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <AttendanceToggle
                            codeId={getStudentAttendanceCode(student.partyId)}
                            onChange={setStudentAttendanceCode(student.partyId)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Box sx={{ p: 2, position: 'sticky', bottom: 0 }}>
              <Box position="relative">
                <Box
                  sx={{
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: showAlertSuccess ? 1 : 0,
                  }}
                >
                  <Fade in={showAlertSuccess}>
                    <Alert
                      severity="success"
                      variant="standard"
                      sx={{ height: '100%', alignItems: 'center', px: 6 }}
                      icon={
                        <ThumbsUpCheckmarkIcon
                          color="success"
                          sx={{ width: '36px', height: '36px' }}
                        />
                      }
                      onClose={() => setAlertSuccess(false)}
                    >
                      <Stack direction="row" spacing={1} alignItems="baseline">
                        <Slide
                          direction="right"
                          in={showAlertSuccess}
                          {...(showAlertSuccess && { timeout: 250 })}
                        >
                          <AlertTitle sx={{ m: 0, color: 'emerald.700' }}>
                            {t('common:success')}
                          </AlertTitle>
                        </Slide>
                        <Typography variant="body2">
                          {t('groups:attendanceUpdated')}
                        </Typography>
                      </Stack>
                    </Alert>
                  </Fade>
                </Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    backgroundColor: 'slate.100',
                    py: 1.5,
                    px: 2,
                    borderRadius: 1.5,
                    borderTop: '1px solid',
                    borderTopColor: 'indigo.50',
                    boxShadow: '0px -1px 10px rgba(99, 102, 241, 0.20)',
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {t('groups:confirmAttendance')}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {isEditing && (
                      <Button
                        color="primary"
                        variant="soft"
                        disabled={isLoading && !showAdditionalLessonsModal}
                        endIcon={<UndoIcon />}
                        onClick={cancelAttendance}
                      >
                        {t('groups:cancelEdits')}
                      </Button>
                    )}
                    <LoadingButton
                      color="primary"
                      variant="contained"
                      loading={
                        isSaveAttendanceLoading && !showAdditionalLessonsModal
                      }
                      endIcon={<SaveIcon />}
                      loadingPosition="end"
                      onClick={handleSaveAttendance}
                    >
                      {t('groups:saveAttendance')}
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </>
        )}
      </Card>
      {showAdditionalLessonsModal && (
        <AdditionalLessonsModal
          events={eventsOnSameDayForSameGroup || []}
          onClose={() => setShowAdditionalLessonsModal(false)}
          onSave={handleSaveAdditionalLessons}
        />
      )}
    </>
  );
};
