import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Fade,
  Tabs,
  Tab,
  Chip,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  DayType,
  useAcademicNamespace,
  Calendar_CreateCalendarDayInput,
} from '@tyro/api';
import {
  ActionMenu,
  useDisclosure,
  getColourBasedOnDayType,
  EditState,
} from '@tyro/core';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { SchoolCalendar } from './calendar';
import { useCalendarDayInfo } from '../../api/school-calendar/calendar-day-info';
import { useUpdateCalendarDays } from '../../api/school-calendar/update-calendar-days';
import { ChangeDateRangeModal } from './change-date-range-modal';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { SetNonSchooldayModal } from './set-non-schoolday-modal';
import { useEditableSchoolCalendarState } from '../../hooks/use-editable-school-calendar-state';

dayjs.extend(LocalizedFormat);

type TabValue = DayType | 'All';

export const CalendarOverview = () => {
  const { t } = useTranslation(['settings']);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const { data, isLoading: isCalendarDayInfoLoading } = useCalendarDayInfo({});

  const { mutateAsync: updateCalendarDays } = useUpdateCalendarDays();

  const [state, setState] = useState<EditState>(EditState.Idle);
  const [currentTabValue, setCurrentTabValue] = useState<TabValue>('All');

  const {
    editedRows,
    selectedDays,
    setEditedRows,
    setSelectedDays,
    handleCalendarChanges,
  } = useEditableSchoolCalendarState(data);

  const bellTimes = useMemo(
    () =>
      (data?.dayInfo ?? []).map((day) =>
        editedRows[day.date]
          ? {
              ...day,
              dayType: (editedRows[day.date].dayType?.newValue ??
                day.dayType) as DayType,
              startTime:
                editedRows[day.date].startTime?.newValue ?? day.startTime,
              endTime: editedRows[day.date].endTime?.newValue ?? day.endTime,
            }
          : day
      ),
    [data?.dayInfo, editedRows]
  );

  const getDayCount = (dayType: DayType) =>
    data?.dayInfo?.filter((day) => day.dayType === dayType)?.length ?? 0;

  const calendarTabData: Array<{
    bgColor: string;
    color?: string;
    translationText: string;
    currentTabValue: DayType | 'All';
    total: number;
  }> = useMemo(
    () => [
      {
        bgColor: 'indigo.100',
        color: 'indigo.500',
        translationText: t('settings:schoolCalendar.dayTypeLabels.All'),
        currentTabValue: 'All',
        total: data?.dayInfo?.length ?? 0,
      },
      {
        ...getColourBasedOnDayType(DayType.Holiday),
        translationText: t('settings:schoolCalendar.dayTypeLabels.HOLIDAY'),
        currentTabValue: DayType.Holiday,
        total: getDayCount(DayType.Holiday),
      },
      {
        ...getColourBasedOnDayType(DayType.StaffDay),
        translationText: t('settings:schoolCalendar.dayTypeLabels.STAFF_DAY'),
        currentTabValue: DayType.StaffDay,
        total: getDayCount(DayType.StaffDay),
      },
      {
        ...getColourBasedOnDayType(DayType.SchoolDay),
        translationText: t('settings:schoolCalendar.dayTypeLabels.SCHOOL_DAY'),
        currentTabValue: DayType.SchoolDay,
        total: getDayCount(DayType.SchoolDay),
      },
    ],
    [data?.dayInfo]
  );

  const {
    isOpen: isDateRangeModalOpen,
    onOpen: onOpenDateRangeModal,
    onClose: onCloseDateRangeModal,
  } = useDisclosure();

  const {
    isOpen: isSetNonSchooldayModalOpen,
    onOpen: onOpenSetNonSchooldayModal,
    onClose: onCloseSetNonSchooldayModal,
  } = useDisclosure();

  const onBulkSave = async () => {
    try {
      setState(EditState.Saving);
      const updates = Object.entries(editedRows).reduce<
        Calendar_CreateCalendarDayInput[]
      >((acc, [date, changes]) => {
        const { dayType, startTime, endTime, description } = changes;
        const dayInfo = data?.dayInfo?.find((day) => day.date === date);

        acc.push({
          date,
          dayType: (dayType?.newValue ?? dayInfo?.dayType) as DayType,
          startTime:
            startTime?.newValue && dayjs(startTime?.newValue).format('HH:mm'),
          endTime:
            endTime?.newValue && dayjs(endTime?.newValue).format('HH:mm'),
          description: description?.newValue,
        });

        return acc;
      }, []);
      await updateCalendarDays({
        calendarId: (data?.id ?? '') as number,
        days: updates,
      });
      setSelectedDays([]);
      setState(EditState.Saved);
      setEditedRows({});
    } catch (e) {
      setState(EditState.Error);
      console.error(e);
    } finally {
      setTimeout(() => {
        setState(EditState.Idle);
      }, 2000);
    }
  };

  const onCancelBulkEdit = () => {
    setSelectedDays([]);
    setEditedRows({});
  };

  const numberOfEdits = useMemo(
    () =>
      Object.values(editedRows).reduce(
        (acc, row) => acc + Object.keys(row).length,
        0
      ),
    [editedRows]
  );

  const actionMenuItems = useMemo(
    () => [
      {
        label: t('settings:schoolCalendar.setAsSchoolDay'),
        onClick: () =>
          handleCalendarChanges({
            dayType: DayType.SchoolDay,
          }),
      },
      {
        label: t('settings:schoolCalendar.setAsNonSchoolDay'),
        onClick: onOpenSetNonSchooldayModal,
      },
    ],
    [selectedDays]
  );

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader
        disableTypography
        subheader={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tabs
              value={currentTabValue}
              onChange={(_event, newValue: TabValue) => {
                setCurrentTabValue(newValue);
                setSelectedDays([]);
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label={t('settings:schoolCalendar.ariaLabelForTabs')}
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
              {calendarTabData.map((item) => (
                <Tab
                  value={item.currentTabValue}
                  key={item.translationText}
                  label={
                    <>
                      <Chip
                        label={item.total}
                        variant="soft"
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: item?.bgColor,
                          borderRadius: '12px',
                          height: '22px',
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
            <Stack alignItems="flex-end" flex={1}>
              <Fade in={!!selectedDays.length} unmountOnExit>
                <Box>
                  <ActionMenu
                    buttonLabel={t('settings:schoolCalendar.setDayType')}
                    menuItems={actionMenuItems}
                  />
                </Box>
              </Fade>
            </Stack>
          </Stack>
        }
      />
      {isCalendarDayInfoLoading ? (
        <Stack minHeight="40vh" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <CardContent>
          <Box
            sx={{
              backgroundColor: { xs: 'transparent', sm: 'slate.50' },
              borderRadius: '16px',
              marginY: 2,
              paddingBottom: 2,
              paddingX: { xs: 0, sm: 4 },
            }}
          >
            <SchoolCalendar
              bellTimes={bellTimes}
              dayTypeFilter={currentTabValue}
              activeAcademicNamespace={activeAcademicNamespace}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
          </Box>
          <ChangeDateRangeModal
            open={isDateRangeModalOpen}
            onClose={onCloseDateRangeModal}
            onSave={handleCalendarChanges}
          />
          <SetNonSchooldayModal
            open={isSetNonSchooldayModalOpen}
            onClose={onCloseSetNonSchooldayModal}
            onSave={handleCalendarChanges}
          />
          <BulkEditSaveBar
            isEditing={numberOfEdits > 0 || state !== EditState.Idle}
            editingState={state}
            numberOfEdits={numberOfEdits}
            onSave={onBulkSave}
            onCancel={onCancelBulkEdit}
          />
        </CardContent>
      )}
    </Card>
  );
};
