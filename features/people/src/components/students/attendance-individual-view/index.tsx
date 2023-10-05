import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Fade,
  FormControlLabel,
  Icon,
  Stack,
  Switch,
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
import { getColourBasedOnAttendanceType } from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useStudentCalendarAttendance } from '@tyro/attendance';
import { AcademicCalendar } from './calendar';
import { AttendanceTableView } from './attendance-table-view';

export type ExtendedAttendanceCodeType =
  | AttendanceCodeType
  | 'ALL'
  | 'PARTIAL_ABSENCE';

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

type TabColor = Record<
  AttendanceCodeType,
  ReturnType<typeof getColourBasedOnAttendanceType>['filled']
>;

const tabColors = Object.values(AttendanceCodeType).reduce<TabColor>(
  (codeTypes, codeType) => {
    codeTypes[codeType] = getColourBasedOnAttendanceType(codeType).filled;

    return codeTypes;
  },
  {} as TabColor
);

export const MonthOverview = () => {
  const { t } = useTranslation(['attendance', 'people']);
  const { id } = useParams();
  const [view, setView] = useState<CalendarView>(CalendarView.Calendar);
  const [showPartialAbsence, setShowPartialAbsence] = useState(false);
  const [value, setValue] = useState(0);
  const [currentTabValue, setCurrentTabValue] =
    useState<ExtendedAttendanceCodeType>('ALL');

  const { activeAcademicNamespace } = useAcademicNamespace();

  const currentDate = dayjs();
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
  const startDate = activeAcademicNamespace?.startDate;
  const endDate = activeAcademicNamespace?.endDate;

  const { data: calendarAttendance, isLoading: calendarAttendanceLoading } =
    useStudentCalendarAttendance({
      partyId: Number(id),
      from: startDate || formattedCurrentDate,
      to: endDate || formattedCurrentDate,
    });

  const attendanceCounts = calendarAttendance?.attendances ?? [];
  const totalAttendanceDays = attendanceCounts.length;

  const partialsByCodeType = useMemo(
    () =>
      (calendarAttendance?.attendances ?? []).reduce(
        (acc, { partiallyTaken, status }) => {
          if (partiallyTaken) {
            const currentCount = acc.get(status);
            acc.set(status, 1 + (currentCount ?? 0));
          }

          return acc;
        },
        new Map<ExtendedAttendanceCodeType, number>()
      ),
    [calendarAttendance]
  );

  const getCodeCount = useCallback(
    (code: ExtendedAttendanceCodeType, defaultCount: number | undefined = 0) =>
      showPartialAbsence
        ? defaultCount - (partialsByCodeType.get(code) ?? 0)
        : defaultCount,
    [partialsByCodeType, showPartialAbsence]
  );

  const attendanceTabData: Array<{
    bgColor: string;
    color: string;
    translationText: string;
    currentTabValue: ExtendedAttendanceCodeType;
    total: number;
  }> = useMemo(
    () => [
      {
        bgColor: 'indigo.100',
        color: 'indigo.500',
        translationText: t('attendance:all'),
        currentTabValue: 'ALL',
        total: totalAttendanceDays,
      },
      {
        ...tabColors.PRESENT,
        translationText: t('attendance:totalPresent'),
        currentTabValue: AttendanceCodeType.Present,
        total: getCodeCount(
          AttendanceCodeType.Present,
          calendarAttendance?.totalPresent
        ),
      },
      {
        ...tabColors.LATE,
        translationText: t('attendance:totalLate'),
        currentTabValue: AttendanceCodeType.Late,
        total: getCodeCount(
          AttendanceCodeType.Late,
          calendarAttendance?.totalLate
        ),
      },
      ...(showPartialAbsence
        ? [
            {
              bgColor: 'amber.500',
              color: 'white',
              translationText: t('attendance:totalPartialAbsence'),
              currentTabValue: 'PARTIAL_ABSENCE',
              total: calendarAttendance?.totalPartial ?? 0,
            } as const,
          ]
        : []),
      {
        ...tabColors.EXPLAINED_ABSENCE,
        translationText: t('attendance:totalAbsent'),
        currentTabValue: AttendanceCodeType.ExplainedAbsence,
        total: getCodeCount(
          AttendanceCodeType.ExplainedAbsence,
          calendarAttendance?.totalAbsent
        ),
      },
      {
        ...tabColors.UNEXPLAINED_ABSENCE,
        translationText: t('attendance:totalUnexplained'),
        currentTabValue: AttendanceCodeType.UnexplainedAbsence,
        total: getCodeCount(
          AttendanceCodeType.UnexplainedAbsence,
          calendarAttendance?.totalUnexplained
        ),
      },
      {
        ...tabColors.NOT_TAKEN,
        translationText: t('attendance:totalNotTaken'),
        currentTabValue: AttendanceCodeType.NotTaken,
        total: getCodeCount(
          AttendanceCodeType.NotTaken,
          calendarAttendance?.totalNotTaken
        ),
      },
    ],
    [calendarAttendance, showPartialAbsence, getCodeCount]
  );

  const viewOptions = [
    {
      value: CalendarView.Calendar,
      label: t('attendance:calendarView'),
      icon: ToggleButtonCalendarIcon,
    },
    {
      value: CalendarView.Table,
      label: t('attendance:tableView'),
      icon: ToggleButtonTableIcon,
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 3,
          marginY: 2,
        }}
      >
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
          {viewOptions.map((option) => (
            <Tooltip key={option?.value} title={option?.label}>
              <ToggleButton
                value={option?.value}
                selected={option?.value === view}
                onChange={() => setView(option?.value)}
                sx={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  border: 0,
                }}
              >
                <Icon
                  component={option?.icon}
                  sx={({ palette }) => ({
                    width: 20,
                    height: 20,
                    '&  g *': {
                      stroke:
                        option.value === view
                          ? palette.indigo?.[500]
                          : palette.slate?.[400],
                    },
                  })}
                />
              </ToggleButton>
            </Tooltip>
          ))}

          <Fade in={view === CalendarView.Calendar}>
            <Box display="flex" sx={{ '&.MuiBox-root': { marginLeft: 0 } }}>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ '&.MuiDivider-root': { marginLeft: '16px' } }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showPartialAbsence}
                    onChange={() => {
                      setValue(0);
                      setCurrentTabValue('ALL');
                      setShowPartialAbsence((current) => !current);
                    }}
                  />
                }
                label={t('attendance:viewPartialAbsence')}
                sx={{ '&.MuiFormControlLabel-root': { marginLeft: '4px' } }}
              />
            </Box>
          </Fade>
        </Stack>
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
            '& .MuiTypography-root': {
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
        <CardContent sx={{ height: '100%' }}>
          {view === 'calendar' ? (
            <>
              <Tabs
                value={value}
                onChange={(_event, newValue: number) => setValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label={t('people:ariaLabelForTabs')}
                sx={{
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'center',
                    marginLeft: 2,
                  },
                  '& .MuiTabs-flexContainer > .MuiButtonBase-root': {
                    marginRight: 3.5,
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
                          label={item.total}
                          variant="soft"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: item?.bgColor,
                            borderRadius: '6px',
                            height: '20px',
                            fontWeight: '700',
                            fontSize: '12px',
                            paddingX: '8px',
                            color: item?.color,
                            '& .MuiChip-icon': {
                              color: item?.color,
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
                            '[aria-selected="true"] &': {
                              color: 'slate.800',
                            },
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
                  marginBottom: 2,
                  paddingBottom: 2,
                  paddingX: { xs: 0, sm: 4 },
                }}
              >
                <AcademicCalendar
                  studentPartyId={id ?? ''}
                  calendarAttendance={calendarAttendance}
                  activeAcademicNamespace={activeAcademicNamespace}
                  currentTabValue={currentTabValue}
                  isPartialAbsenceEnabled={showPartialAbsence}
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
