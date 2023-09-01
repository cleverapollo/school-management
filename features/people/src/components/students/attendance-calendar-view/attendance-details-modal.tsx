import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  RHFSelect,
  RHFTextField,
  PreferredNameFormat,
  usePreferredNameLayout,
} from '@tyro/core';
import { AttendanceToggle, useAttendanceCodes } from '@tyro/attendance';
import {
  AttendanceCodeType,
  UserType,
  usePermissions,
  SaveEventAttendanceInput,
  SaveStudentSessionAttendanceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseStudentSessionAttendance,
  useStudentSessionAttendance,
} from '../../../api/student/attendance/student-session-attendance';
import { useStudentDailyCalendarInformation } from '../../../api/student/attendance/daily-calendar-information';
import { useCreateOrUpdateEventAttendance } from '../../../api/student/attendance/save-student-event-attendance';
import { useCreateOrUpdateSessionAttendance } from '../../../api/student/attendance/save-student-session-attendance';
import { useBellTimesQuery } from '../../../api/student/attendance/calendar-bell-times';
import { useStudent } from '../../../api/student/students';

type AttendanceInput = {
  id: number;
  note: string | null;
  attendanceCodeId: number | null;
};

type AttendanceForm = {
  sessionAttendance: Record<string, AttendanceInput>;
  eventAttendance: Record<string, AttendanceInput>;
};

type AttendanceDetailsModalProps = {
  day: string;
  studentId: number;
  onClose: () => void;
};

export const AttendanceDetailsModal = ({
  day,
  studentId,
  onClose,
}: AttendanceDetailsModalProps) => {
  const { t } = useTranslation(['attendance', 'people', 'common']);
  const { userType } = usePermissions();
  const { handleSubmit, control, setValue, setError } =
    useForm<AttendanceForm>();
  const [openAlert, setOpenAlert] = useState(true);

  const isTeacherUserType = userType === UserType.Teacher;

  const { displayName } = usePreferredNameLayout();

  const { data: studentData } = useStudent(studentId);

  const { data: eventAttendance = [], isLoading: isTimetableLoading } =
    useStudentDailyCalendarInformation({
      resources: {
        partyIds: [studentId],
      },
      endDate: day,
      startDate: day,
    });

  const {
    data: sessionAttendanceData = [],
    isLoading: isSessionAttendanceLoading,
  } = useStudentSessionAttendance({
    partyIds: [studentId],
    from: day,
    to: day,
  });

  const { data: bellTimes = [], isLoading: isBelltimesLoading } =
    useBellTimesQuery({
      fromDate: day,
      toDate: day,
    });

  const { data: attendanceCodes = [], isLoading: isAttendanceCodesLoading } =
    useAttendanceCodes({
      teachingGroupCodes: isTeacherUserType,
    });

  const {
    mutateAsync: createOrUpdateSessionAttendance,
    isLoading: isSessionAttendanceSubmitting,
  } = useCreateOrUpdateSessionAttendance();

  const {
    mutateAsync: createOrUpdateEventAttendance,
    isLoading: isEventAttendanceSubmitting,
  } = useCreateOrUpdateEventAttendance();

  const isSubmitting =
    isSessionAttendanceSubmitting || isEventAttendanceSubmitting;

  const isLoading =
    isTimetableLoading ||
    isSessionAttendanceLoading ||
    isBelltimesLoading ||
    isAttendanceCodesLoading;

  const sessionAttendanceById = useMemo(
    () =>
      sessionAttendanceData?.reduce((acc, current) => {
        acc[current.bellTimeId] = current;

        return acc;
      }, {} as Record<number, ReturnTypeFromUseStudentSessionAttendance[number]>),
    [sessionAttendanceData]
  );

  const [eventAttendanceCodesMap, setEventAttandanceCodeMap] =
    useState<Record<number, number | null>>();

  const [attendanceCodesMap, setAttandanceCodesMap] =
    useState<Record<number, number | null>>();

  const bellTimesWithName = useMemo(
    () => (bellTimes || []).filter((bellTime) => bellTime?.name),
    [bellTimes]
  );

  useEffect(() => {
    if (isLoading) return;

    bellTimesWithName.forEach((bellTime) => {
      const currentBellTime = sessionAttendanceById?.[bellTime.id];

      setAttandanceCodesMap((prev) => {
        const newState = {
          ...prev,
        };
        newState[bellTime.id] = currentBellTime?.attendanceCode?.id || null;
        return newState;
      });

      setValue(`sessionAttendance.${bellTime.id}`, {
        id: bellTime.id,
        note: currentBellTime?.note || null,
        attendanceCodeId: currentBellTime?.attendanceCode?.id || null,
      });
    });
  }, [isLoading, sessionAttendanceById, bellTimesWithName]);

  useEffect(() => {
    if (isLoading) return;

    eventAttendance.forEach((event) => {
      const [currentEvent] = event?.extensions?.eventAttendance || [];
      setEventAttandanceCodeMap((prev) => {
        const newState = {
          ...prev,
        };
        newState[event.eventId] = currentEvent?.attendanceCodeId || null;
        return newState;
      });
      setValue(`eventAttendance.${event.eventId}`, {
        id: event.eventId,
        note: currentEvent?.note || null,
        attendanceCodeId: currentEvent?.attendanceCodeId || null,
      });
    });
  }, [isLoading, eventAttendance]);

  const onSubmit = handleSubmit(async (data) => {
    // const requiredEventAttendance = Object.values(data.eventAttendance).filter(
    //   ({ note, attendanceCodeId }) => note && !attendanceCodeId
    // );

    // requiredEventAttendance.forEach((eventA) => {
    //   setError(`eventAttendance.${eventA.id}.attendanceCodeId`, {
    //     message: t('common:errorMessages.required'),
    //   });
    // });

    // if (requiredEventAttendance.length > 0) return;

    const sessionAttendanceInput: SaveStudentSessionAttendanceInput[] =
      Object.values(data.sessionAttendance)
        .filter(({ attendanceCodeId, note }) => attendanceCodeId || note)
        .map(({ id, note, attendanceCodeId }) => ({
          note,
          attendanceCodeId: isTeacherUserType
            ? attendanceCodesMap?.[id]
            : attendanceCodeId,
          bellTimeId: id,
          date: day,
          studentPartyId: studentId,
          adminSubmitted: true,
        }));

    if (sessionAttendanceInput.length > 0) {
      await createOrUpdateSessionAttendance(sessionAttendanceInput);
    }

    const eventAttendanceInput: SaveEventAttendanceInput[] = Object.values(
      data.eventAttendance
    )
      // .filter(({ attendanceCodeId }) => attendanceCodeId)
      .map(({ id, note, attendanceCodeId }) => {
        const attendanceCode = isTeacherUserType
          ? eventAttendanceCodesMap?.[id]
          : attendanceCodeId;

        return {
          note,
          attendanceCodeId: attendanceCode!,
          eventId: id,
          date: day,
          personPartyId: studentId,
          adminSubmitted: true,
        };
      });

    if (eventAttendanceInput.length > 0) {
      await createOrUpdateEventAttendance(eventAttendanceInput);
    }

    onClose();
  });

  return (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('attendance:attendanceDetailsFor', {
          date: dayjs(day)?.format('L'),
        })}
      </DialogTitle>
      {isLoading ? (
        <Stack minHeight="60vh" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <form onSubmit={onSubmit}>
          <DialogContent>
            <Collapse in={openAlert}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                icon={
                  <LightBulbIcon
                    fontSize="inherit"
                    sx={{ color: 'blue.800' }}
                  />
                }
                sx={{
                  marginBottom: 3,
                  backgroundColor: 'indigo.50',
                  color: 'blue.800',
                }}
              >
                <AlertTitle>
                  {t('people:studentAttendanceAlertTitleModal')}
                </AlertTitle>
                {t('people:studentAttendanceAlertBodyModal')}
              </Alert>
            </Collapse>
            <Typography variant="body2" color="text.disabled">
              {t('attendance:studentAttendanceModalMessage', {
                student: displayName(studentData?.person, {
                  format: PreferredNameFormat.FirstnameSurname,
                }),
              })}
            </Typography>
            <TableContainer>
              <Table
                size="small"
                sx={{
                  mt: 4,
                  '& th': {
                    background: 'transparent',
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                  '& tbody td': {
                    verticalAlign: 'baseline',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {[
                      t('attendance:time'),
                      t('attendance:type'),
                      t('attendance:takenBy'),
                      t('attendance:notes'),
                      t('attendance:attendance'),
                    ].map((heading) => (
                      <TableCell key={heading}>
                        <Typography
                          color="text.disabled"
                          variant="subtitle2"
                          sx={{ textWrap: 'noWrap' }}
                        >
                          {heading}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody
                  sx={({ palette, spacing }) => ({
                    borderTop: `1px solid ${palette.divider}`,
                    borderBottom: `1px solid ${palette.divider}`,
                    '&::before, &::after': {
                      content: '""',
                      display: 'block',
                      height: spacing(1),
                    },
                  })}
                >
                  {bellTimesWithName.map((event) => {
                    const sessionAttendance = sessionAttendanceById?.[event.id];
                    const creatorName = displayName(
                      sessionAttendance?.createdBy,
                      {
                        format: PreferredNameFormat.FirstnameSurname,
                      }
                    );

                    const bellTimeId = event?.id;

                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              color="text.disabled"
                              variant="subtitle2"
                            >
                              {event?.time}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              variant="subtitle2"
                              sx={{ textWrap: 'noWrap' }}
                            >
                              {event?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {sessionAttendance?.createdBy && (
                            <Stack direction="row" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 14,
                                }}
                                name={creatorName}
                                src={sessionAttendance?.createdBy?.avatarUrl}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ textWrap: 'noWrap', marginLeft: 1 }}
                              >
                                {creatorName || '-'}
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            flexGrow="1"
                            padding={0}
                            sx={{
                              '& .MuiFormControl-root .MuiInputBase-input': {
                                minWidth: { xs: '200px', md: 0 },
                                paddingY: 1,
                              },
                            }}
                          >
                            <RHFTextField
                              textFieldProps={{
                                fullWidth: true,
                              }}
                              controlProps={{
                                name: `sessionAttendance.${event.id}.note`,
                                control,
                              }}
                            />
                          </Stack>
                        </TableCell>
                        {isTeacherUserType ? (
                          <TableCell>
                            <pre>
                              {`${JSON.stringify(
                                attendanceCodesMap?.[bellTimeId]
                              )}`}
                            </pre>

                            <AttendanceToggle
                              codeId={
                                attendanceCodesMap?.[bellTimeId] || undefined
                              }
                              onChange={(current) => {
                                setAttandanceCodesMap((prev) => ({
                                  ...prev,
                                  [bellTimeId]: current,
                                }));
                              }}
                            />
                          </TableCell>
                        ) : (
                          <TableCell>
                            <Stack
                              direction="row"
                              padding={0}
                              sx={{ '& .MuiSelect-select': { paddingY: 1 } }}
                            >
                              <RHFSelect
                                fullWidth
                                options={attendanceCodes}
                                getOptionLabel={(option) => option?.name}
                                optionIdKey="id"
                                controlProps={{
                                  name: `sessionAttendance.${event.id}.attendanceCodeId`,
                                  control,
                                }}
                              />
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableBody
                  sx={({ spacing }) => ({
                    '&::before': {
                      content: '""',
                      display: 'block',
                      height: spacing(1),
                    },
                  })}
                >
                  {eventAttendance?.map((event) => {
                    const [currentEvent] =
                      event?.extensions?.eventAttendance || [];

                    const creatorName = displayName(currentEvent?.createdBy, {
                      format: PreferredNameFormat.FirstnameSurname,
                    });

                    const eventId = event?.eventId;
                    const attendanceCode = currentEvent?.attendanceCodeId;

                    return (
                      <TableRow key={event?.eventId}>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              color="text.disabled"
                              variant="subtitle2"
                            >
                              {dayjs(event?.startTime).format('HH:mm')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              variant="subtitle2"
                              sx={{ textWrap: 'noWrap' }}
                            >
                              {event?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {currentEvent?.createdBy && (
                            <Stack direction="row" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 14,
                                }}
                                name={creatorName}
                                src={currentEvent?.createdBy?.avatarUrl}
                              />

                              <Typography
                                variant="subtitle2"
                                sx={{ textWrap: 'noWrap', marginLeft: 1 }}
                              >
                                {creatorName || '-'}
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            flexGrow="1"
                            padding={0}
                            sx={{
                              '& .MuiFormControl-root .MuiInputBase-input': {
                                minWidth: { xs: '200px', md: 0 },
                                paddingY: 1,
                              },
                            }}
                          >
                            <RHFTextField
                              textFieldProps={{
                                fullWidth: true,
                              }}
                              controlProps={{
                                name: `eventAttendance.${event.eventId}.note`,
                                control,
                              }}
                            />
                          </Stack>
                        </TableCell>
                        {isTeacherUserType ? (
                          <TableCell>
                            <pre>
                              {`${JSON.stringify(
                                eventAttendanceCodesMap?.[eventId]
                              )}`}
                            </pre>
                            <AttendanceToggle
                              codeId={
                                eventAttendanceCodesMap?.[eventId] ?? undefined
                              }
                              onChange={(current) => {
                                // Update the edited values array when the toggle value changes
                                setEventAttandanceCodeMap((prev) => ({
                                  ...prev,
                                  [eventId]: current,
                                }));
                              }}
                            />
                          </TableCell>
                        ) : (
                          <TableCell>
                            <Stack
                              direction="row"
                              padding={0}
                              sx={{ '& .MuiSelect-select': { paddingY: 1 } }}
                            >
                              <RHFSelect
                                fullWidth
                                options={attendanceCodes}
                                getOptionLabel={(option) => option?.name}
                                optionIdKey="id"
                                controlProps={{
                                  name: `eventAttendance.${event.eventId}.attendanceCodeId`,
                                  control,
                                }}
                              />
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <pre>{JSON.stringify(eventAttendanceCodesMap)}</pre>
            <pre>{JSON.stringify(attendanceCodesMap)}</pre>
            <Button variant="soft" color="inherit" onClick={onClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {t('common:actions.save')}
            </LoadingButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};
