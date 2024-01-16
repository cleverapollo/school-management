import {
  Card,
  Stack,
  Typography,
  Skeleton,
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';

import { AttendanceToggle } from '@tyro/attendance';

import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@tyro/icons';
import { usePreferredNameLayout, EditState, useToast } from '@tyro/core';
import { useEffect, useState } from 'react';
import { StudentAvatar } from '@tyro/people';
import { AttendanceCodeType } from '@tyro/api';
import { useHandleLessonAttendance, GroupStudent } from '../../../hooks';
import { AdditionalLessonsModal } from './additional-lessons-modal';
import { SaveBar } from './save-bar';

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
  const { toast } = useToast();

  const { t } = useTranslation(['common', 'groups', 'attendance']);
  const { displayName } = usePreferredNameLayout();

  const {
    lessonId,
    currentLesson,
    attendance,
    updatedAt,
    updatedBy,
    unsavedChanges,
    isFirstTime,
    isLessonLoading,
    isEmptyLesson,
    formattedLessonDate,
    isSaveAttendanceLoading,
    additionalLessons,
    previousAttendanceTypeByPersonPartyId,
    nextLesson,
    previousLesson,
    getStudentEventDetails,
    getStudentAttendanceCode,
    setStudentAttendanceCode,
    editAttendance,
    saveAttendance,
    cancelAttendance,
  } = useHandleLessonAttendance({
    partyId,
    eventStartTime,
    students,
  });

  const [editingState, setEditingState] = useState<EditState>(EditState.Idle);
  const [showAdditionalLessonsModal, setShowAdditionalLessonsModal] =
    useState(false);

  useEffect(() => {
    setEditingState(EditState.Idle);
  }, [lessonId, unsavedChanges]);

  useEffect(() => {
    if (isSaveAttendanceLoading) {
      setEditingState(EditState.Saving);
    }
  }, [isSaveAttendanceLoading]);

  const handleSaveCurrentAttendance = () => {
    saveAttendance({
      lessonIds: [lessonId],
      onSuccess: (invalidateQuery) => {
        setEditingState(EditState.Saved);

        setTimeout(async () => {
          await invalidateQuery();
          setShowAdditionalLessonsModal(additionalLessons.length > 0);
        }, 250);
      },
    });
  };

  const handleSaveAdditionalLessons = (lessonIds: number[]) => {
    saveAttendance({
      lessonIds,
      onSuccess: async (invalidateQuery) => {
        await invalidateQuery();
        setShowAdditionalLessonsModal(false);
        toast(t('common:snackbarMessages.updateSuccess'));
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
                const submittedBy = displayName(
                  eventDetails?.updatedBy ?? eventDetails?.createdBy
                );
                const previousLessonCode =
                  previousAttendanceTypeByPersonPartyId.get(student.partyId) ??
                  AttendanceCodeType.NotTaken;

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
                          <Typography
                            variant="body2"
                            color={
                              previousAttendanceCodeColor[previousLessonCode]
                            }
                          >
                            {previousLessonCode === AttendanceCodeType.NotTaken
                              ? '-'
                              : t(
                                  `attendance:previousAttendanceCode.${previousLessonCode}`
                                )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {eventDetails?.isEditMode ? (
                        <AttendanceToggle
                          codeId={getStudentAttendanceCode(student.partyId)}
                          onChange={setStudentAttendanceCode(student.partyId)}
                        />
                      ) : (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Stack direction="column">
                            <Typography variant="caption" fontWeight={600}>
                              {eventDetails?.attendanceCode?.name ?? '-'}
                            </Typography>
                            {eventDetails?.note && (
                              <Typography component="span" variant="caption">
                                {eventDetails?.note}
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
                          <IconButton
                            aria-label={t('common:actions.edit')}
                            color="primary"
                            onClick={() => editAttendance(student.partyId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <SaveBar
        isFirstTime={isFirstTime}
        editingState={editingState}
        attendance={attendance}
        updatedAt={updatedAt}
        updatedBy={updatedBy}
        unsavedChanges={unsavedChanges}
        onCancel={cancelAttendance}
        onSave={handleSaveCurrentAttendance}
      />

      {showAdditionalLessonsModal && (
        <AdditionalLessonsModal
          isSaving={editingState === EditState.Saving}
          attendance={attendance}
          currentLesson={currentLesson}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          lessons={additionalLessons}
          onClose={() => setShowAdditionalLessonsModal(false)}
          onSave={handleSaveAdditionalLessons}
        />
      )}
    </>
  );
};
