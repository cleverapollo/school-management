import {
  Alert,
  AlertTitle,
  Box,
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
  PlaceholderCard,
} from '@tyro/core';
import {
  useAttendanceCodes,
  useCreateOrUpdateEventAttendance,
  useCreateOrUpdateSessionAttendance,
  useStudentSessionAttendance,
  ReturnTypeFromUseStudentSessionAttendance,
  useStudentDailyCalendarInformation,
  useBellTimesQuery,
} from '@tyro/attendance';
import { SaveEventAttendanceInput, SessionAttendanceInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
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
  const { handleSubmit, control, setValue, setError, getFieldState } =
    useForm<AttendanceForm>();
  const [openAlert, setOpenAlert] = useState(true);

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
      teachingGroupCodes: false,
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

  const bellTimesWithName = useMemo(
    () => (bellTimes || []).filter((bellTime) => bellTime?.name),
    [bellTimes]
  );

  useEffect(() => {
    if (isLoading) return;

    bellTimesWithName.forEach((bellTime) => {
      const currentBellTime = sessionAttendanceById?.[bellTime.id];
      const attendanceCodeId = currentBellTime?.attendanceCode?.id || null;

      setValue(`sessionAttendance.${bellTime.id}`, {
        id: bellTime.id,
        note: currentBellTime?.note || null,
        attendanceCodeId,
      });
    });
  }, [isLoading, sessionAttendanceById, bellTimesWithName]);

  useEffect(() => {
    if (isLoading) return;

    eventAttendance.forEach((event) => {
      const [currentEvent] = event?.extensions?.eventAttendance || [];
      const attendanceCodeId = currentEvent?.attendanceCodeId || null;

      setValue(`eventAttendance.${event.eventId}`, {
        id: event.eventId,
        note: currentEvent?.note || null,
        attendanceCodeId,
      });
    });
  }, [isLoading, eventAttendance]);

  const onSubmit = handleSubmit(async (data) => {
    const updatedSessionAttendance = Object.values(
      data?.sessionAttendance ?? {}
    )?.filter(({ id }) => getFieldState(`sessionAttendance.${id}`).isDirty);

    const updatedEventAttendance = Object.values(
      data?.eventAttendance ?? {}
    )?.filter(({ id }) => getFieldState(`eventAttendance.${id}`).isDirty);

    const requiredEventAttendance = Object.values(
      data?.eventAttendance ?? {}
    ).filter(({ note, attendanceCodeId }) => note && !attendanceCodeId);

    requiredEventAttendance.forEach((eventA) => {
      setError(`eventAttendance.${eventA.id}.attendanceCodeId`, {
        message: t('common:errorMessages.required'),
      });
    });

    if (requiredEventAttendance.length > 0) return;

    const sessionAttendances: SessionAttendanceInput[] =
      updatedSessionAttendance.map(({ id, note, attendanceCodeId }) => ({
        note,
        attendanceCodeId,
        bellTimeId: id,
        date: day,
        studentPartyId: studentId,
      }));

    if (sessionAttendances.length > 0) {
      await createOrUpdateSessionAttendance({
        attendances: sessionAttendances,
        adminSubmitted: true,
      });
    }

    const eventAttendanceInput: SaveEventAttendanceInput[] =
      updatedEventAttendance.map(({ id, note, attendanceCodeId }) => ({
        note,
        attendanceCodeId: attendanceCodeId!,
        eventId: id,
        date: day,
        personPartyId: studentId,
        adminSubmitted: true,
      }));

    if (eventAttendanceInput.length > 0) {
      await createOrUpdateEventAttendance(eventAttendanceInput);
    }

    onClose();
  });

  return isLoading ? (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="md">
      <DialogTitle
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('attendance:attendanceDetailsFor', {
          date: dayjs(day)?.format('L'),
        })}
      </DialogTitle>
      <Stack minHeight="60vh" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    </Dialog>
  ) : (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="md">
      <DialogTitle
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('attendance:attendanceDetailsFor', {
          date: dayjs(day)?.format('L'),
        })}
      </DialogTitle>
      {sessionAttendanceData.length === 0 && eventAttendance.length === 0 ? (
        <>
          <DialogContent>
            <PlaceholderCard cardProps={{ sx: { boxShadow: 'none', p: 0 } }}>
              <Box>
                <Typography component="h4" variant="subtitle1">
                  {t('attendance:noLessonsScheduled')}
                </Typography>
              </Box>
            </PlaceholderCard>
          </DialogContent>
          <DialogActions>
            <Button variant="soft" color="inherit" onClick={onClose}>
              {t('common:actions.cancel')}
            </Button>
          </DialogActions>
        </>
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
                    verticalAlign: 'middle',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {[
                      t('attendance:time'),
                      t('attendance:type'),
                      t('attendance:takenBy'),
                      t('common:details'),
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

                    const lastPersonUpdater =
                      sessionAttendance?.updatedBy ||
                      sessionAttendance?.createdBy;

                    const creatorName = displayName(lastPersonUpdater, {
                      format: PreferredNameFormat.FirstnameSurname,
                    });

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
                          <Stack direction="row" alignItems="center">
                            {lastPersonUpdater && (
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 14,
                                }}
                                name={creatorName}
                                src={lastPersonUpdater?.avatarUrl}
                              />
                            )}
                            <Typography
                              variant="subtitle2"
                              sx={{ textWrap: 'noWrap', marginLeft: 1 }}
                            >
                              {creatorName || '-'}
                            </Typography>
                          </Stack>
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
                        <TableCell>
                          <Stack
                            direction="row"
                            padding={0}
                            sx={{
                              '& .MuiSelect-select': { paddingY: 1 },
                            }}
                          >
                            <RHFSelect
                              fullWidth
                              options={attendanceCodes?.filter(
                                (code) => code?.active
                              )}
                              getOptionLabel={(option) => option?.name}
                              optionIdKey="id"
                              canDeleteValue
                              onChange={({ target }) => {
                                if (!target.value) {
                                  setValue(
                                    `sessionAttendance.${event.id}.note`,
                                    ''
                                  );
                                }
                              }}
                              controlProps={{
                                name: `sessionAttendance.${event.id}.attendanceCodeId`,
                                control,
                              }}
                            />
                          </Stack>
                        </TableCell>
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

                    const lastPersonUpdater =
                      currentEvent?.updatedBy || currentEvent?.createdBy;

                    const creatorName = displayName(lastPersonUpdater, {
                      format: PreferredNameFormat.FirstnameSurname,
                    });

                    return (
                      <TableRow key={event.eventId}>
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
                          <Stack direction="row" alignItems="center">
                            {creatorName && (
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 14,
                                }}
                                name={creatorName}
                                src={lastPersonUpdater?.avatarUrl}
                              />
                            )}

                            <Typography
                              variant="subtitle2"
                              sx={{
                                textWrap: 'noWrap',
                                marginLeft: 1,
                              }}
                            >
                              {creatorName || '-'}
                            </Typography>
                          </Stack>
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
                        <TableCell>
                          <Stack
                            direction="row"
                            padding={0}
                            sx={{
                              '& .MuiSelect-select': { paddingY: 1 },
                            }}
                          >
                            <RHFSelect
                              fullWidth
                              options={attendanceCodes}
                              getOptionLabel={(option) => option?.name}
                              optionIdKey="id"
                              canDeleteValue
                              onChange={({ target }) => {
                                if (!target.value) {
                                  setValue(
                                    `eventAttendance.${event.eventId}.note`,
                                    ''
                                  );
                                }
                              }}
                              controlProps={{
                                name: `eventAttendance.${event.eventId}.attendanceCodeId`,
                                control,
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
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
