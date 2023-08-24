import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
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
import { useState } from 'react';
import { useAttendanceQuery } from '../../../api/student/attendance/student-session-attendance';
import { useStudentDailyCalendarInformation } from '../../../api/student/attendance/daily-calendar-information';
import { useCreateOrUpdateEventAttendance } from '../../../api/student/attendance/save-student-event-attendance';
import { useCreateOrUpdateSessionAttendance } from '../../../api/student/attendance/save-student-session-attendance';
import { useBellTimesQuery } from '../../../api/student/attendance/calendar-bell-times';
import { useStudent } from '../../../api/student/students';

export type SessionAttendanceProps = {
  open: boolean;
  onClose: () => void;
  day: string;
  studentId: number;
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
  open,
  onClose,
  day,
  studentId,
}: SessionAttendanceProps) => {
  const { t } = useTranslation(['attendance', 'people', 'common']);
  const { userType } = usePermissions();
  const { handleSubmit, control, reset } = useForm<EventAttendanceInputProps>();
  const [openAlert, setOpenAlert] = useState(true);

  const isTeacherUserType = userType === UserType.Teacher;

  const { displayName } = usePreferredNameLayout();

  const { data: timetable, isLoading } = useStudentDailyCalendarInformation({
    resources: {
      partyIds: [studentId],
    },
    endDate: day,
    startDate: day,
  });

  const { data: sessionAttendanceData } = useAttendanceQuery({
    partyIds: [studentId],
    from: day,
    to: day,
  });

  const { data: bellTimes } = useBellTimesQuery({
    fromDate: day,
    toDate: day,
  });

  const { data: attendanceCodes } = useAttendanceCodes({
    teachingGroupCodes: isTeacherUserType,
  });

  const { mutateAsync: createOrUpdateSessionAttendance } =
    useCreateOrUpdateSessionAttendance();

  const { mutateAsync: createOrUpdateEventAttendance } =
    useCreateOrUpdateEventAttendance();

  const { data: studentData } = useStudent(studentId);
  const name = displayName(studentData?.person, {
    format: PreferredNameFormat.FirstnameSurname,
  });

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
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
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
      <form onSubmit={onSubmit}>
        <DialogContent>
          {!isLoading && timetable && (
            <>
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
              <Typography color="slate.500" fontSize="14px">
                {t('attendance:studentAttendanceModalMessage', {
                  student: name,
                })}
              </Typography>
              <Table
                size="small"
                sx={{
                  marginY: 4,
                  '& th': {
                    background: 'transparent',
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        color="#637381"
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {t('attendance:time')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="#637381"
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {t('attendance:type')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="#637381"
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {t('attendance:takenBy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="#637381"
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {t('attendance:notes')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="#637381"
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {t('attendance:attendance')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Divider sx={{ marginY: 1, fill: 'red' }} />
                  </TableCell>
                </TableRow>

                <TableBody
                  sx={{
                    '& tb': {
                      marginY: 2,
                      borderBottom: '1px solid #f1f5f9',
                    },
                  }}
                >
                  {bellTimes &&
                    sessionAttendanceData &&
                    bellTimes
                      ?.filter((bellTime) => bellTime?.name)
                      ?.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row">
                              <Typography
                                variant="body2"
                                color="#637381"
                                fontWeight="600"
                              >
                                {event?.time}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row">
                              <Typography
                                variant="body2"
                                color="#212B36"
                                fontWeight="600"
                                fontSize="14px"
                                sx={{ textWrap: 'noWrap' }}
                              >
                                {event?.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center">
                              {sessionAttendanceData
                                ? sessionAttendanceData &&
                                  sessionAttendanceData[index]?.createdBy && (
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: 14,
                                      }}
                                      name={displayName(
                                        sessionAttendanceData &&
                                          sessionAttendanceData[index]
                                            ?.createdBy,
                                        {
                                          format:
                                            PreferredNameFormat.FirstnameSurname,
                                        }
                                      )}
                                      src={
                                        sessionAttendanceData[index]
                                          ?.createdBy &&
                                        sessionAttendanceData[index]?.createdBy
                                          ?.avatarUrl
                                      }
                                    />
                                  )
                                : ''}
                              <Typography
                                variant="body2"
                                color="#212B36"
                                fontWeight="600"
                                fontSize="14px"
                                sx={{ textWrap: 'noWrap', marginLeft: 1 }}
                              >
                                {displayName(
                                  sessionAttendanceData &&
                                    sessionAttendanceData[index]?.createdBy,
                                  {
                                    format:
                                      PreferredNameFormat.FirstnameSurname,
                                  }
                                )}
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
                              <RHFTextField<EventAttendanceInputProps>
                                key={index}
                                textFieldProps={{
                                  fullWidth: true,
                                }}
                                controlProps={{
                                  name: `sessionAttendanceNote-${event?.id}` as keyof EventAttendanceInputProps,
                                  control,
                                  defaultValue:
                                    sessionAttendanceData[index]?.note ?? '',
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
                              <RHFSelect<
                                EventAttendanceInputProps,
                                AttendanceCodeInputProps
                              >
                                fullWidth
                                options={attendanceCodes ?? []}
                                getOptionLabel={(option) => option?.name}
                                optionIdKey="id"
                                controlProps={{
                                  name: `attendanceCode-${event?.id}` as keyof EventAttendanceInputProps,
                                  control,
                                  defaultValue:
                                    sessionAttendanceData[index]?.attendanceCode
                                      ?.id ?? 0,
                                }}
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Divider sx={{ marginY: 1 }} />
                  </TableCell>
                </TableRow>
                <TableBody>
                  {timetable &&
                    timetable?.map((event) => (
                      <TableRow key={event?.eventId}>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              variant="body2"
                              color="#637381"
                              fontWeight="600"
                            >
                              {dayjs(event?.startTime).format('HH:mm')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              variant="body2"
                              color="#212B36"
                              fontWeight="600"
                              fontSize="14px"
                              sx={{ textWrap: 'noWrap' }}
                            >
                              {event?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center">
                            {event?.extensions?.eventAttendance &&
                              event?.extensions?.eventAttendance[0]
                                ?.createdBy && (
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: 14,
                                  }}
                                  name={displayName(
                                    event?.extensions?.eventAttendance &&
                                      event?.extensions?.eventAttendance[0]
                                        ?.createdBy,
                                    {
                                      format:
                                        PreferredNameFormat.FirstnameSurname,
                                    }
                                  )}
                                  src={
                                    event?.extensions?.eventAttendance &&
                                    event?.extensions?.eventAttendance[0]
                                      ?.createdBy?.avatarUrl
                                  }
                                />
                              )}

                            <Typography
                              variant="body2"
                              color="#212B36"
                              fontWeight="600"
                              fontSize="14px"
                              sx={{ textWrap: 'noWrap', marginLeft: 1 }}
                            >
                              {displayName(
                                event?.extensions?.eventAttendance &&
                                  event?.extensions?.eventAttendance[0]
                                    ?.createdBy,
                                {
                                  format: PreferredNameFormat.FirstnameSurname,
                                }
                              )}
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
                            <RHFTextField<EventAttendanceInputProps>
                              key={event?.eventId}
                              textFieldProps={{
                                fullWidth: true,
                              }}
                              controlProps={{
                                name: `note-${event?.eventId}` as keyof EventAttendanceInputProps,
                                control,
                                defaultValue:
                                  (event?.extensions?.eventAttendance &&
                                    event?.extensions?.eventAttendance[0]
                                      ?.note) ||
                                  '',
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
                            <RHFSelect<
                              EventAttendanceInputProps,
                              AttendanceCodeInputProps
                            >
                              fullWidth
                              options={attendanceCodes ?? []}
                              getOptionLabel={(option) => option?.name}
                              optionIdKey="id"
                              controlProps={{
                                name: `index_${event?.eventId}` as keyof EventAttendanceInputProps,
                                control,
                                defaultValue:
                                  (event?.extensions?.eventAttendance &&
                                    event?.extensions?.eventAttendance[0]
                                      ?.attendanceCodeId) ||
                                  '',
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="soft" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('common:actions.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
