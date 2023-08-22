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
  CloudUploadIcon,
  ThumbsUpCheckmarkIcon,
  TrashIcon,
} from '@tyro/icons';
import { useNumber, Avatar, usePreferredNameLayout } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useSubjectGroupById } from '../../../api/subject-groups';
import { useHandleLessonAttendance } from '../../../hooks';

export default function SubjectGroupProfileAttendancePage() {
  const { t } = useTranslation(['groups', 'common']);
  const { displayName } = usePreferredNameLayout();

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);
  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const students = subjectGroupData?.students || [];

  const {
    lessonId,
    isEditing,
    isLessonLoading,
    isEmptyLesson,
    formattedLessonDate,
    isSaveAttendanceLoading,
    nextLesson,
    previousLesson,
    getStudentAttendanceCode,
    setStudentAttendanceCode,
    saveAttendance,
    cancelAttendance,
  } = useHandleLessonAttendance({
    partyId: groupIdNumber!,
    students,
  });

  const [showAlertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    setAlertSuccess(false);
  }, [lessonId]);

  const handleSaveAttendance = () => {
    saveAttendance({
      onSuccess: () => setAlertSuccess(true),
    });
  };

  const isLoading = isLessonLoading || isSaveAttendanceLoading;

  return (
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
          disabled={isLoading || isEmptyLesson}
          onClick={nextLesson}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
      {isEmptyLesson ? (
        <Stack justifyContent="center" alignItems="center" minHeight={300}>
          <Typography variant="h6" component="span">
            {t('groups:lessonAttendanceNotFound')}
          </Typography>
        </Stack>
      ) : (
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
              {students.map((student) => (
                <TableRow key={student?.partyId}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        name={displayName(student?.person)}
                        src={student?.person?.avatarUrl}
                      />
                      <Stack direction="column">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {displayName(student?.person)}
                        </Typography>
                        <Typography variant="body2">
                          {student?.classGroup?.name ?? '-'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <AttendanceToggle
                      codeId={getStudentAttendanceCode(student.partyId)}
                      onChange={setStudentAttendanceCode(student.partyId)}
                    />
                  </TableCell>
                </TableRow>
              ))}
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
                  backgroundColor: 'slate.50',
                  border: '1px solid',
                  borderColor: 'slate.100',
                  borderRadius: 1.5,
                  py: 1.5,
                  px: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('groups:confirmAttendance')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  {isEditing && (
                    <Button
                      color="primary"
                      variant="soft"
                      disabled={isLoading}
                      startIcon={<TrashIcon />}
                      onClick={cancelAttendance}
                    >
                      {t('groups:cancelEdits')}
                    </Button>
                  )}
                  <LoadingButton
                    color="primary"
                    variant="contained"
                    loading={isSaveAttendanceLoading}
                    startIcon={<CloudUploadIcon />}
                    loadingPosition="start"
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
  );
}
