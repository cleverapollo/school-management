import { useState } from 'react';
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
import { useCoreAcademicNamespace } from '@tyro/api';
import { ToggleButtonCalendarIcon, ToggleButtonTableIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { AcademicCalendar } from './calendar';
import { useStudentCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';
import { AttendanceTableView } from './attendance-table-view';

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
  const [currentTabValue, setCurrentTabValue] = useState('All');
  const [showCalendarView, setShowCalendarView] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const attendanceCodeColours = [
    {
      colour: 'indigo',
      translationText: t('attendance:all'),
      calendarAttendanceTotals: 'all',
      currentTabValue: 'All',
    },
    {
      colour: 'emerald',
      translationText: t('attendance:totalPresent'),
      calendarAttendanceTotals: 'totalPresent',
      currentTabValue: 'PRESENT',
    },
    {
      colour: 'sky',
      translationText: t('attendance:totalLate'),
      calendarAttendanceTotals: 'totalLate',
      currentTabValue: 'LATE',
    },
    {
      colour: 'pink',
      translationText: t('attendance:totalAbsent'),
      calendarAttendanceTotals: 'totalAbsent',
      currentTabValue: 'EXPLAINED_ABSENCE',
    },
    {
      colour: 'red',
      translationText: t('attendance:totalUnexplained'),
      calendarAttendanceTotals: 'totalUnexplained',
      currentTabValue: 'UNEXPLAINED_ABSENCE',
    },
    {
      colour: 'grey',
      translationText: t('attendance:totalNotTaken'),
      calendarAttendanceTotals: 'totalNotTaken',
      currentTabValue: 'NOT_TAKEN',
    },
  ];

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
                aria-label="scrollable auto tabs for highlighting attendance types"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'center',
                    margin: 0,
                  },
                }}
              >
                {attendanceCodeColours.map((item) => (
                  <Tab
                    onClick={() => setCurrentTabValue(item?.currentTabValue)}
                    label={
                      <>
                        <Chip
                          label={
                            item && item?.translationText === 'All'
                              ? totalAttendanceDays?.toString()
                              : calendarAttendance &&
                                calendarAttendance[
                                  item?.calendarAttendanceTotals as keyof typeof calendarAttendance
                                ]?.toString()
                          }
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: `${item?.colour}.100`,
                            borderRadius: '6px',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: `${item?.colour}.500`,
                            '& .MuiChip-icon': {
                              color: `${item?.colour}.500`,
                            },
                            '& .MuiChip-label': {
                              padding: 0,
                            },
                          }}
                        />
                        <Typography
                          color="#637381"
                          marginLeft={1}
                          sx={{
                            fontWeight: '600',
                            fontSize: '14px',
                            textWrap: 'nowrap',
                            textTransform: 'none',
                          }}
                        >
                          {item.translationText}
                        </Typography>
                      </>
                    }
                  />
                ))}
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
                  currentTabValue={currentTabValue}
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
