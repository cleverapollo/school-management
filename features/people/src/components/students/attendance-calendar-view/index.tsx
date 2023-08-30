import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTranslation } from '@tyro/i18n';
import {
  useCoreAcademicNamespace,
  AcademicNamespace,
  AttendanceCodeType,
} from '@tyro/api';
import { ToggleButtonCalendarIcon, ToggleButtonTableIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useState } from 'react';
import { SearchInput } from '@tyro/core';
import { AcademicCalendar } from './calendar';
import { useStudentCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';
import { AttendanceTableView } from './attendance-table-view';

const attendanceCodeColours = [
  { colour: 'indigo', translationText: 'all' },
  { colour: 'emerald', translationText: 'totalPresent' },
  { colour: 'sky', translationText: 'totalLate' },
  { colour: 'pink', translationText: 'totalAbsent' },
  { colour: 'red', translationText: 'totalUnexplained' },
  { colour: 'grey', translationText: 'totalNotTaken' },
];

export const MonthOverview = () => {
  const { t } = useTranslation(['attendance', 'people']);
  const { id } = useParams();

  const { data: namespaces, isLoading: loadingNameSpaces } =
    useCoreAcademicNamespace();
  const activeAcademicNamespace = namespaces?.find(
    (academicNamespace) => academicNamespace?.isActiveDefaultNamespace
  );

  const currentDate = dayjs();
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
  const startDate = activeAcademicNamespace?.startDate;
  const endDate = activeAcademicNamespace?.endDate;

  const { data: calendarAttendance, isLoading: calendarAttendanceLoading } =
    useStudentCalendarAttendance({
      partyId: Number(id),
      from: !startDate ? formattedCurrentDate : startDate,
      to: !endDate ? formattedCurrentDate : endDate,
    });

  const attendanceCounts = calendarAttendance?.attendances ?? [];
  const totalAttendanceDays = attendanceCounts.length;

  const [value, setValue] = useState(0);
  const [mappedValue, setMappedValue] = useState('ALL');
  const [showCalendarView, setShowCalendarView] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 3,
          marginY: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <Box
            sx={{
              borderColor: 'indigo.50',
              borderStyle: 'solid',
              borderRadius: 1,
              paddingLeft: '6px',
              paddingTop: '6px',
              width: '32px',
              height: '32px',
              backgroundColor: showCalendarView ? 'indigo.100' : 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setShowCalendarView(true)}
          >
            <ToggleButtonCalendarIcon
              sx={{
                height: '20px',
                width: '20px',
                marginRight: 2,

                '& g *': {
                  stroke: showCalendarView ? '#6366F1' : '#94A3B8',
                },
              }}
            />
          </Box>

          <Box
            sx={{
              marginLeft: 1,
              borderColor: 'indigo.50',
              borderStyle: 'solid',
              borderRadius: 1,
              paddingLeft: '6px',
              paddingTop: '6px',
              width: '32px',
              height: '32px',
              backgroundColor: !showCalendarView ? 'indigo.100' : 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setShowCalendarView(false)}
          >
            <ToggleButtonTableIcon
              sx={{
                height: '20px',
                width: '20px',
                '& g *': {
                  stroke: !showCalendarView ? '#6366F1' : '#94A3B8',
                },
              }}
            />
          </Box>
        </Box>
        <CardHeader
          component="h3"
          title={t(`people:academicYear`, {
            year: activeAcademicNamespace?.name,
          })}
          sx={{
            p: 0,
            border: 0,
            textAlign: 'center',
            fontWeight: 600,
            '& .css-8ebtji-MuiTypography-root': {
              fontWeight: 600,
            },
          }}
        />
        {/* <SearchInput
          value="Search"
          onChange={(e) => State.log('hello')}
          sx={{ fontSize: '0.875rem' }}
          containerProps={{ sx: { my: 1 } }}
        /> */}
      </Stack>
      {calendarAttendanceLoading ? (
        <Stack minHeight="40vh" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <CardContent>
          {showCalendarView ? (
            <>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'center',

                    margin: 0,
                  },
                }}
              >
                <Tab
                  onClick={() => setMappedValue('ALL')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `indigo.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={totalAttendanceDays}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `indigo.500`,
                            '& .MuiChip-icon': {
                              color: `indigo.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(`attendance:all` as keyof typeof calendarAttendance)}
                      </Typography>
                    </>
                  }
                />

                <Tab
                  onClick={() => setMappedValue('PRESENT')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `emerald.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={calendarAttendance?.totalPresent}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `emerald.500`,
                            '& .MuiChip-icon': {
                              color: `emerald.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(
                          `attendance:totalPresent` as keyof typeof calendarAttendance
                        )}
                      </Typography>
                    </>
                  }
                />

                <Tab
                  onClick={() => setMappedValue('LATE')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `sky.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={calendarAttendance?.totalLate}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `sky.500`,

                            '& .MuiChip-icon': {
                              color: `sky.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(
                          `attendance:totalLate` as keyof typeof calendarAttendance
                        )}
                      </Typography>
                    </>
                  }
                />

                <Tab
                  onClick={() => setMappedValue('EXPLAINED_ABSENCE')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `pink.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={calendarAttendance?.totalAbsent}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `pink.500`,

                            '& .MuiChip-icon': {
                              color: `pink.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(
                          `attendance:totalAbsent` as keyof typeof calendarAttendance
                        )}
                      </Typography>
                    </>
                  }
                />

                <Tab
                  onClick={() => setMappedValue('UNEXPLAINED_ABSENCE')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `red.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={calendarAttendance?.totalUnexplained}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `red.500`,
                            '& .MuiChip-icon': {
                              color: `red.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(
                          `attendance:totalUnexplained` as keyof typeof calendarAttendance
                        )}
                      </Typography>
                    </>
                  }
                />

                <Tab
                  onClick={() => setMappedValue('NOT_TAKEN')}
                  label={
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `grey.100`,
                          borderRadius: '6px',
                          padding: 0,
                        }}
                      >
                        <Chip
                          label={calendarAttendance?.totalNotTaken}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `grey.500`,
                            '& .MuiChip-icon': {
                              color: `grey.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {t(
                          `attendance:totalNotTaken` as keyof typeof calendarAttendance
                        )}
                      </Typography>
                    </>
                  }
                />
              </Tabs>
              <Box
                sx={{
                  backgroundColor: { xs: 'transparent', sm: 'slate.50' },
                  borderRadius: '16px',
                  marginY: 2,
                  paddingBottom: 2,
                  paddingX: { xs: 0, sm: 4 },
                }}
              >
                <AcademicCalendar
                  studentPartyId={id ?? ''}
                  calendarAttendance={calendarAttendance}
                  activeAcademicNamespace={activeAcademicNamespace}
                  mappedValue={mappedValue}
                />
              </Box>
            </>
          ) : (
            <AttendanceTableView
              startDate={startDate ?? formattedCurrentDate}
              endDate={endDate ?? formattedCurrentDate}
              studentId={id ?? '0'}
              showCalendarView={showCalendarView}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};
