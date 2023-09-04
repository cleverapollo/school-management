import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useCoreAcademicNamespace } from '@tyro/api';
import { ToggleButtonCalendarIcon, ToggleButtonTableIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { AcademicCalendar } from './calendar';
import { useStudentCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';
import { AttendanceTableView } from './attendance-table-view';

const getViewOptions = (t: TFunction<'attendance'[]>) =>
  [
    {
      value: 'calendar',
      label: t('attendance:calendarView'),
      icon: ToggleButtonCalendarIcon,
    },
    {
      value: 'table',
      label: t('attendance:tableView'),
      icon: ToggleButtonTableIcon,
    },
  ] as const;

export type ViewOption = ReturnType<typeof getViewOptions>[number];
interface ViewToggleButtonProps {
  value: ViewOption['value'];
  label: ViewOption['label'];
  icon: ViewOption['icon'];
  selected: boolean;
  onChange: (value: ViewOption['value']) => void;
}

function ViewToggleButton({
  value,
  label,
  icon: Icon,
  selected,
  onChange,
}: ViewToggleButtonProps) {
  return (
    <Tooltip title={label}>
      <ToggleButton
        value={value}
        selected={selected}
        onChange={() => onChange(value)}
        sx={{
          width: 32,
          height: 32,
          padding: 0,
          border: 0,
        }}
      >
        <Icon
          sx={{
            width: 20,
            height: 20,
            '&  g *': {
              stroke: selected ? '#6366F1' : '#94A3B8',
            },
          }}
        />
      </ToggleButton>
    </Tooltip>
  );
}

interface AttendanceViewSwitcherProps {
  value: ViewOption['value'];
  onChange: (value: ViewOption['value']) => void;
}

function AttendanceViewSwitcher({
  value,
  onChange,
}: AttendanceViewSwitcherProps) {
  const { t } = useTranslation(['attendance']);
  const viewOptions = useMemo(() => getViewOptions(t), [t]);

  return (
    <Stack
      role="group"
      aria-label={t('attendance:changeRolebookView')}
      direction="row"
      spacing={1}
      sx={{
        button: {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'slate.100',
          color: 'slate.500',

          '&.Mui-selected': {
            borderColor: 'indigo.200',
            color: 'primary.main',
            backgroundColor: 'indigo.50',

            '&:hover': {
              backgroundColor: 'indigo.100',
            },
          },
        },
      }}
    >
      {viewOptions.map((props) => (
        <ViewToggleButton
          key={props.value}
          {...props}
          selected={props.value === value}
          onChange={onChange}
        />
      ))}
    </Stack>
  );
}

export const MonthOverview = () => {
  const { t } = useTranslation(['attendance', 'people']);
  const { id } = useParams();
  const [view, setView] = useState<'calendar' | 'table'>('calendar');

  const { data: namespaces } = useCoreAcademicNamespace();
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const attendanceTabData = [
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
        <AttendanceViewSwitcher value={view} onChange={setView} />
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
          {view === 'calendar' ? (
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
                {attendanceTabData.map((item) => (
                  <Tab
                    key={item.translationText}
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
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};
