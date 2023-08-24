import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
} from '@mui/material';
import {
  Avatar,
  RHFSelect,
  RHFTextField,
  PreferredNameFormat,
  usePreferredNameLayout,
  TableLoadingOverlay,
} from '@tyro/core';
import {
  UserType,
  usePermissions,
  SaveEventAttendanceInput,
  SaveStudentSessionAttendanceInput,
  AttendanceCode,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useAttendanceCodes } from '@tyro/attendance';
import { useMemo, useState } from 'react';
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

export type SessionAttendanceProps = {
  day: string;
  studentId: number;
  onClose: () => void;
};

type EventAttendanceInputProps = {
  bellTimeId: number;
  eventId: number;
  attendanceCodeId: number;
  date: string;
  note?: string;
  id: number;
  personPartyId: number;
  studentPartyId: number;
};

export type AttendanceCodeInputProps = Pick<
  AttendanceCode,
  'id' | 'code' | 'name'
>;

export const AttendanceDetailsModal = ({
  day,
  studentId,
  onClose,
}: SessionAttendanceProps) => {
  const { t } = useTranslation(['attendance', 'people', 'common']);
  const { userType } = usePermissions();
  const { handleSubmit, control, reset } = useForm<EventAttendanceInputProps>();
  const [openAlert, setOpenAlert] = useState(true);

  const isTeacherUserType = userType === UserType.Teacher;

  const { displayName } = usePreferredNameLayout();

  const { data: timetable = [], isLoading: isTimetableLoading } =
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

  const { data: studentData } = useStudent(studentId);

  const onSubmit = handleSubmit(async (data: EventAttendanceInputProps) => {
    const transformedSessionAttendanceData = Object.keys(data).reduce<
      SaveStudentSessionAttendanceInput[]
    >((acc, fieldName) => {
      if (fieldName.startsWith('sessionAttendanceNote-')) {
        const ids = fieldName.replace('sessionAttendanceNote-', '');
        const sessionAttendanceNote =
          data[fieldName as keyof EventAttendanceInputProps];
        const indexField = `attendanceCode-${ids}`;
        const [eventId] = indexField.split('-').slice(1);
        const attendanceCodeId = Number(
          data[`attendanceCode-${eventId}` as keyof EventAttendanceInputProps]
        );
        if (attendanceCodeId) {
          acc.push({
            note: sessionAttendanceNote?.toString(),
            attendanceCodeId,
            date: day,
            bellTimeId: Number(eventId),
            studentPartyId: studentId,
            adminSubmitted: true,
          });
        }
      }
      return acc;
    }, [] as SaveStudentSessionAttendanceInput[]);

    const transformedEventAttendanceData = Object.keys(data).reduce<
      SaveEventAttendanceInput[]
    >((acc, fieldName) => {
      if (fieldName.startsWith('note-')) {
        const eventId = fieldName.replace('note-', '');
        const note = data[fieldName as keyof EventAttendanceInputProps];
        const indexField = `index_${eventId}`;
        const eventIdValue =
          data[indexField as keyof EventAttendanceInputProps];

        if (eventIdValue !== '') {
          acc.push({
            note: note?.toString(),
            attendanceCodeId: Number(eventIdValue),
            date: day,
            eventId: Number(eventId),
            personPartyId: studentId,
            adminSubmitted: true,
          });
        }
      }
      return acc;
    }, []);

    if (
      Array.isArray(transformedSessionAttendanceData) &&
      transformedSessionAttendanceData?.length > 0
    ) {
      await createOrUpdateSessionAttendance(transformedSessionAttendanceData);
    }

    if (
      Array.isArray(transformedEventAttendanceData) &&
      transformedEventAttendanceData?.length > 0
    ) {
      await createOrUpdateEventAttendance(transformedEventAttendanceData);
    }

    reset();
    onClose();
  });

  const handleClose = () => {
    setOpenAlert(true);
    reset();
    onClose();
  };

  return (
    <Dialog open onClose={handleClose} scroll="paper" fullWidth maxWidth="md">
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
        <Stack minHeight="60vh" justifyContent="center">
          <TableLoadingOverlay />
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
            <Table
              size="small"
              sx={{
                mt: 4,
                '& th': {
                  background: 'transparent',
                  color: 'text.primary',
                  fontWeight: 600,
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
                      <Typography color="text.disabled" variant="subtitle2">
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
                {bellTimes
                  ?.filter((bellTime) => bellTime?.name)
                  ?.map((event) => {
                    const sessionAttendance = sessionAttendanceById?.[event.id];
                    const creatorName = displayName(
                      sessionAttendance?.createdBy,
                      {
                        format: PreferredNameFormat.FirstnameSurname,
                      }
                    );

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
                                name: `sessionAttendanceNote-${event?.id}` as keyof EventAttendanceInputProps,
                                control,
                                defaultValue: sessionAttendance?.note ?? '',
                              }}
                            />
                          </Stack>
                        </TableCell>
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
                                name: `attendanceCode-${event?.id}` as keyof EventAttendanceInputProps,
                                control,
                                defaultValue:
                                  sessionAttendance?.attendanceCode?.id ?? 0,
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
                {timetable?.map((event) => {
                  const [eventAttendance] =
                    event?.extensions?.eventAttendance || [];

                  const creatorName = displayName(eventAttendance?.createdBy, {
                    format: PreferredNameFormat.FirstnameSurname,
                  });

                  return (
                    <TableRow key={event?.eventId}>
                      <TableCell>
                        <Stack direction="row">
                          <Typography color="text.disabled" variant="subtitle2">
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
                        {eventAttendance?.createdBy && (
                          <Stack direction="row" alignItems="center">
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: 14,
                              }}
                              name={creatorName}
                              src={eventAttendance?.createdBy?.avatarUrl}
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
                              name: `note-${event?.eventId}` as keyof EventAttendanceInputProps,
                              control,
                              defaultValue: eventAttendance?.note || '',
                            }}
                          />
                        </Stack>
                      </TableCell>
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
                              name: `index_${event?.eventId}` as keyof EventAttendanceInputProps,
                              control,
                              defaultValue:
                                eventAttendance?.attendanceCodeId || '',
                            }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button variant="soft" color="inherit" onClick={handleClose}>
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
