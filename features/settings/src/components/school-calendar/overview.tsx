import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Icon,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useAcademicNamespace, AttendanceCodeType } from '@tyro/api';
import { ToggleButtonCalendarIcon, ToggleButtonTableIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useCalendarDayInfo } from '../../api/school-calendar/day-info';

export type ExtendedAttendanceCodeType = AttendanceCodeType | 'ALL';

export type AttendanceDataType = {
  colour: string;
  translationText: TFunction<'attendance'[]>;
  currentTabValue: ExtendedAttendanceCodeType;
  total: number;
};

enum CalendarView {
  Calendar = 'calendar',
  Table = 'table',
}

export const CalendarOverview = () => {
  const { t } = useTranslation(['attendance', 'people']);
  const { id } = useParams();
  const [view, setView] = useState<CalendarView>(CalendarView.Calendar);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const currentDate = dayjs();
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
  const startDate = activeAcademicNamespace?.startDate;
  const endDate = activeAcademicNamespace?.endDate;

  const { data: calendarDayInfo, isLoading: calendarDayInfoLoading } =
    useCalendarDayInfo({
      fromDate: startDate || formattedCurrentDate,
      toDate: endDate || formattedCurrentDate,
    });
  
  console.log('================>', calendarDayInfo, calendarDayInfoLoading)

  // const attendanceCounts = calendarAttendance?.attendances ?? [];
  // const totalAttendanceDays = attendanceCounts.length;
  //
  // const [value, setValue] = useState(0);
  // const [currentTabValue, setCurrentTabValue] =
  //   useState<ExtendedAttendanceCodeType>('ALL');
  //
  // const attendanceTabData: Array<{
  //   colour: string;
  //   translationText: string;
  //   currentTabValue: ExtendedAttendanceCodeType;
  //   total: number;
  // }> = [
  //   {
  //     colour: 'indigo',
  //     translationText: t('attendance:all'),
  //     currentTabValue: 'ALL',
  //     total: totalAttendanceDays,
  //   },
  //   {
  //     colour: 'emerald',
  //     translationText: t('attendance:totalPresent'),
  //     currentTabValue: AttendanceCodeType.Present,
  //     total: calendarAttendance?.totalPresent ?? 0,
  //   },
  //   {
  //     colour: 'sky',
  //     translationText: t('attendance:totalLate'),
  //     currentTabValue: AttendanceCodeType.Late,
  //     total: calendarAttendance?.totalLate ?? 0,
  //   },
  //   {
  //     colour: 'pink',
  //     translationText: t('attendance:totalAbsent'),
  //     currentTabValue: AttendanceCodeType.ExplainedAbsence,
  //     total: calendarAttendance?.totalAbsent ?? 0,
  //   },
  //   {
  //     colour: 'red',
  //     translationText: t('attendance:totalUnexplained'),
  //     currentTabValue: AttendanceCodeType.UnexplainedAbsence,
  //     total: calendarAttendance?.totalUnexplained ?? 0,
  //   },
  //   {
  //     colour: 'grey',
  //     translationText: t('attendance:totalNotTaken'),
  //     currentTabValue: AttendanceCodeType.NotTaken,
  //     total: calendarAttendance?.totalNotTaken ?? 0,
  //   },
  // ];
  //
  // const viewOptions = [
  //   {
  //     value: CalendarView.Calendar,
  //     label: t('attendance:calendarView'),
  //     icon: ToggleButtonCalendarIcon,
  //   },
  //   {
  //     value: CalendarView.Table,
  //     label: t('attendance:tableView'),
  //     icon: ToggleButtonTableIcon,
  //   },
  // ];

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      {/*<Stack*/}
      {/*  direction="row"*/}
      {/*  sx={{*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'space-between',*/}
      {/*    paddingX: 3,*/}
      {/*    marginY: 2,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Stack*/}
      {/*    role="group"*/}
      {/*    aria-label={t('attendance:changeRolebookView')}*/}
      {/*    direction="row"*/}
      {/*    spacing={1}*/}
      {/*    sx={{*/}
      {/*      button: {*/}
      {/*        borderStyle: 'solid',*/}
      {/*        borderWidth: 1,*/}
      {/*        borderColor: 'slate.100',*/}
      {/*        color: 'slate.500',*/}
      
      {/*        '&.Mui-selected': {*/}
      {/*          borderColor: 'indigo.200',*/}
      {/*          color: 'primary.main',*/}
      {/*          backgroundColor: 'indigo.50',*/}
      
      {/*          '&:hover': {*/}
      {/*            backgroundColor: 'indigo.100',*/}
      {/*          },*/}
      {/*        },*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {viewOptions.map((option) => (*/}
      {/*      <Tooltip key={option?.value} title={option?.label}>*/}
      {/*        <ToggleButton*/}
      {/*          value={option?.value}*/}
      {/*          selected={option?.value === view}*/}
      {/*          onChange={() => setView(option?.value)}*/}
      {/*          sx={{*/}
      {/*            width: 32,*/}
      {/*            height: 32,*/}
      {/*            padding: 0,*/}
      {/*            border: 0,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Icon*/}
      {/*            component={option?.icon}*/}
      {/*            sx={({ palette }) => ({*/}
      {/*              width: 20,*/}
      {/*              height: 20,*/}
      {/*              '&  g *': {*/}
      {/*                stroke:*/}
      {/*                  option.value === view*/}
      {/*                    ? palette.indigo?.[500]*/}
      {/*                    : palette.slate?.[400],*/}
      {/*              },*/}
      {/*            })}*/}
      {/*          />*/}
      {/*        </ToggleButton>*/}
      {/*      </Tooltip>*/}
      {/*    ))}*/}
      {/*  </Stack>*/}
      {/*  <CardHeader*/}
      {/*    component="h3"*/}
      {/*    title={t(`people:academicYear`, {*/}
      {/*      year: activeAcademicNamespace?.name,*/}
      {/*    })}*/}
      {/*    sx={{*/}
      {/*      p: 0,*/}
      {/*      border: 0,*/}
      {/*      textAlign: 'center',*/}
      {/*      fontWeight: 600,*/}
      {/*      '& .MuiTypography-root': {*/}
      {/*        fontWeight: 600,*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Stack>*/}
      {/*{calendarAttendanceLoading ? (*/}
      {/*  <Stack minHeight="40vh" justifyContent="center" alignItems="center">*/}
      {/*    <CircularProgress />*/}
      {/*  </Stack>*/}
      {/*) : (*/}
      {/*  <CardContent>*/}
      {/*    {view === 'calendar' ? (*/}
      {/*      <>*/}
      {/*        <Tabs*/}
      {/*          value={value}*/}
      {/*          onChange={(_event, newValue: number) => setValue(newValue)}*/}
      {/*          variant="scrollable"*/}
      {/*          scrollButtons="auto"*/}
      {/*          aria-label={t('people:ariaLabelForTabs')}*/}
      {/*          sx={{*/}
      {/*            '& .MuiTabs-flexContainer': {*/}
      {/*              alignItems: 'center',*/}
      {/*              margin: 0,*/}
      {/*            },*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          {attendanceTabData.map((item) => (*/}
      {/*            <Tab*/}
      {/*              key={item.translationText}*/}
      {/*              onClick={() => setCurrentTabValue(item?.currentTabValue)}*/}
      {/*              label={*/}
      {/*                <>*/}
      {/*                  <Chip*/}
      {/*                    label={item.total}*/}
      {/*                    variant="soft"*/}
      {/*                    sx={{*/}
      {/*                      cursor: 'pointer',*/}
      {/*                      backgroundColor: `${item?.colour}.100`,*/}
      {/*                      borderRadius: '6px',*/}
      {/*                      height: '20px',*/}
      {/*                      fontWeight: '700',*/}
      {/*                      fontSize: '12px',*/}
      {/*                      paddingX: '8px',*/}
      {/*                      color: `${item?.colour}.500`,*/}
      {/*                      '& .MuiChip-icon': {*/}
      {/*                        color: `${item?.colour}.500`,*/}
      {/*                      },*/}
      {/*                      '& .MuiChip-label': {*/}
      {/*                        padding: 0,*/}
      {/*                      },*/}
      {/*                    }}*/}
      {/*                  />*/}
      {/*                  <Typography*/}
      {/*                    color="#637381"*/}
      {/*                    marginLeft={1}*/}
      {/*                    sx={{*/}
      {/*                      fontWeight: '600',*/}
      {/*                      fontSize: '14px',*/}
      {/*                      textWrap: 'nowrap',*/}
      {/*                      textTransform: 'none',*/}
      {/*                    }}*/}
      {/*                  >*/}
      {/*                    {item.translationText}*/}
      {/*                  </Typography>*/}
      {/*                </>*/}
      {/*              }*/}
      {/*            />*/}
      {/*          ))}*/}
      {/*        </Tabs>*/}
      {/*        <Box*/}
      {/*          sx={{*/}
      {/*            backgroundColor: { xs: 'transparent', sm: 'slate.50' },*/}
      {/*            borderRadius: '16px',*/}
      {/*            marginY: 2,*/}
      {/*            paddingBottom: 2,*/}
      {/*            paddingX: { xs: 0, sm: 4 },*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <AcademicCalendar*/}
      {/*            studentPartyId={id ?? ''}*/}
      {/*            calendarAttendance={calendarAttendance}*/}
      {/*            activeAcademicNamespace={activeAcademicNamespace}*/}
      {/*            currentTabValue={currentTabValue}*/}
      {/*          />*/}
      {/*        </Box>*/}
      {/*      </>*/}
      {/*    ) : (*/}
      {/*      <AttendanceTableView*/}
      {/*        startDate={startDate ?? formattedCurrentDate}*/}
      {/*        endDate={endDate ?? formattedCurrentDate}*/}
      {/*        studentId={id ?? '0'}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*  </CardContent>*/}
      {/*)}*/}
    </Card>
  );
};
