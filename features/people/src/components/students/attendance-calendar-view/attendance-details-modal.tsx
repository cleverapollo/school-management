import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
  Fade,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Input,
  TextareaAutosize,
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
  SaveStudentSessionAttendanceInput,
  AttendanceCode,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { AttendanceToggle, useAttendanceCodes } from '@tyro/attendance';
import { useState } from 'react';
import {
  ReturnTypeFromUseStudentSessionAttendance,
  useAttendanceQuery,
} from '../../../api/student/attendance/student-session-attendance';
import { useTimetable } from '../../../api/student/attendance/daily-calendar-information';
import { useCreateOrUpdateEventAttendance } from '../../../api/student/attendance/save-student-event-attendance';
import { useStudent } from '../../../api/student/students';

export type SessionAttendanceProps = {
  open: boolean;
  onClose: () => void;
  attendance: ReturnTypeFromUseStudentSessionAttendance;
  day: string;
  studentId: number;
};

type SessionAttendanceInputProps = {
  bellTimeId: number;
  attendanceCodeId: number;
  studentPartyId: number;
  date: string;
  note: string;
};

type EventAttendanceInputProps = {
  eventId: number;
  attendanceCodeId: number;
  date: string;
  note: string;
  id: number;
  personPartyId: number;
};

export type AttendanceCodeInputProps = Pick<
  AttendanceCode,
  'id' | 'code' | 'name'
>;

export const AttendanceDetailsModal = ({
  open,
  onClose,
  attendance,
  day,
  studentId,
}: SessionAttendanceProps) => {
  const { t } = useTranslation(['attendance', 'people', 'common']);
  const { userType } = usePermissions();
  const { handleSubmit, control } = useForm<EventAttendanceInputProps>();
  const {
    handleSubmit: handleSessionAttendanceSubmit,
    control: sessionAttendanceControl,
  } = useForm<SessionAttendanceInputProps>();
  const currentDate = dayjs();

  const [openAlert, setOpenAlert] = useState(true);

  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
  const isAdminUserType = userType === UserType.Admin;
  const isTeacherUserType = userType === UserType.Teacher;

  const { displayName } = usePreferredNameLayout();

  // Gets the student's current lessons for the day
  const { data: timetable, isLoading } = useTimetable({
    resources: {
      partyIds: [studentId],
    },
    endDate: !day ? formattedCurrentDate : day,
    startDate: !day ? formattedCurrentDate : day,
  });

  const { data: sessionAttendanceData } = useAttendanceQuery({
    partyIds: [studentId],
    from: !day ? formattedCurrentDate : day,
    to: !day ? formattedCurrentDate : day,
  });

  const { data: attendanceCodes } = useAttendanceCodes({
    teachingGroupCodes: !!isTeacherUserType,
  });

  const { mutate: createOrUpdateEventAttendance } =
    useCreateOrUpdateEventAttendance();

  console.log(timetable, 'timetable');
  console.log(attendance, 'attendance');
  console.log(attendanceCodes, 'attendanceCodes');
  console.log(sessionAttendanceData, 'sessionAttendanceData');

  const { data: studentData } = useStudent(studentId);
  const name = displayName(studentData?.person, {
    format: PreferredNameFormat.FirstnameSurname,
  });

  const onSubmit = handleSubmit(({ ...data }) => {
    const transformedData = Object.keys(data).reduce((acc, fieldName) => {
      if (fieldName.startsWith('note-')) {
        const eventId = fieldName.replace('note-', '');
        console.log(eventId, 'eventId');

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const note = data[fieldName];
        const indexField = `index_${eventId}`;
        // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const eventIdValue = data[indexField];

        if (eventIdValue !== '') {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          acc.push({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            note,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            attendanceCodeId: eventIdValue,
            date: day,
            eventId: Number(eventId),
            personPartyId: studentId,
          });
        }
      }
      return acc;
    }, []);

    onClose();
    // @ts-ignore
    createOrUpdateEventAttendance(transformedData, { onSuccess: onClose });
  });

  const handleClose = () => {
    setOpenAlert(true);
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
          date: dayjs(day)?.format('DD-MM-YYYY'),
        })}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          {isLoading && <Typography variant="body1">Loading</Typography>}

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
                    Changes made will delete previous Attendance
                  </AlertTitle>
                  Once changes are saved, they can be edited again.
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
                    // borderBottom: '1px solid #f1f5f9',
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

                <TableBody
                  sx={{
                    '& tb': {
                      marginY: 2,
                      borderBottom: '1px solid #f1f5f9',
                    },
                  }}
                >
                  {sessionAttendanceData
                    ?.filter(
                      (event) => event?.bellTime?.time && event?.bellTime?.name
                    )
                    .map((event) => (
                      <TableRow key={event?.bellTimeId}>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              variant="body2"
                              color="#637381"
                              fontWeight="600"
                            >
                              {event?.bellTime?.time}
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
                              {event?.bellTime?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center">
                            {event && event?.createdBy && (
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 14,
                                }}
                                name={displayName(event && event?.createdBy, {
                                  format: PreferredNameFormat.FirstnameSurname,
                                })}
                                src={
                                  event?.createdBy &&
                                  event?.createdBy?.avatarUrl
                                }
                              />
                            )}
                            <Typography
                              variant="body2"
                              color="#212B36"
                              fontWeight="600"
                              fontSize="14px"
                              sx={{ textWrap: 'noWrap' }}
                            >
                              {displayName(event && event?.createdBy, {
                                format: PreferredNameFormat.FirstnameSurname,
                              })}
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
                            <RHFTextField<SessionAttendanceInputProps>
                              key={event?.bellTimeId}
                              textFieldProps={{
                                fullWidth: true,
                              }}
                              controlProps={{
                                name: `note-${event?.bellTimeId}` as keyof SessionAttendanceInputProps,
                                control: sessionAttendanceControl,
                                defaultValue:
                                  (event?.note && event?.note) || '',
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
                              SessionAttendanceInputProps,
                              AttendanceCodeInputProps
                            >
                              fullWidth
                              options={attendanceCodes ?? []}
                              getOptionLabel={(option) => option?.name}
                              optionIdKey="id"
                              controlProps={{
                                name: `index_${event?.bellTimeId}` as keyof SessionAttendanceInputProps,
                                control: sessionAttendanceControl,
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>

                <TableBody>
                  {timetable
                    ?.sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    )
                    ?.map((event) => (
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
