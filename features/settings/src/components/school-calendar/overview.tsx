import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Fade,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  DayType,
  useAcademicNamespace,
  Calendar_CreateCalendarDayInput,
  Scalars,
  CalendarDayInfo,
} from '@tyro/api';
import { ActionMenu, useDisclosure, useCacheWithExpiry } from '@tyro/core';
import { CalendarDayTypeIcon } from '@tyro/icons/src/calendar-day-type';
import { useState, useMemo } from 'react';
import * as React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { isEqual } from 'lodash';
import { SchoolCalendar } from './calendar';
import { useCalendarDayInfo } from '../../api/school-calendar/calendar-day-info';
import { useUpdateCalendarDays } from '../../api/school-calendar/update-calendar-days';
import { ChangeDateRangeModal } from './change-date-range-modal';
import { BulkEditSaveBar } from './bulk-edit-save-bar';

dayjs.extend(LocalizedFormat);

type EditedRow = Record<
  string,
  Record<
    string,
    {
      originalValue: any;
      newValue: any;
    }
  >
>;

export enum EditState {
  Idle = 'IDLE',
  Saving = 'SAVING',
  Saved = 'SAVED',
  Error = 'ERROR',
}

export const CalendarOverview = () => {
  const { t } = useTranslation(['settings']);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const { data, isLoading: isCalendarDayInfoLoading } = useCalendarDayInfo({});

  const {
    mutateAsync: updateCalendarDays,
    isLoading: isUpdateCalendarDaysLoading,
  } = useUpdateCalendarDays({});

  const [dayTypeFilter, setDayTypeFilter] = useState<DayType | 'All'>('All');
  const [selectedDays, setSelectedDays] = useState<CalendarDayInfo[]>([]);
  const [state, setState] = useState<EditState>(EditState.Idle);
  const [editedRows, setEditedRows] = useCacheWithExpiry<EditedRow>(
    'bulk-edit',
    {}
  );

  const dayTypes = [
    {
      label: 'All',
    },
    {
      label: DayType.SchoolDay,
      color: 'blue.500',
    },
    {
      label: DayType.StaffDay,
      color: 'orange.500',
    },
    {
      label: DayType.Holiday,
      color: 'green.500',
    },
  ];

  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const onBulkSave = async () => {
    try {
      setState(EditState.Saving);
      const updates = Object.entries(editedRows).reduce<
        Calendar_CreateCalendarDayInput[]
      >((acc, [date, changes]) => {
        const { dayType, startTime, endTime } = changes;
        acc.push({
          date,
          dayType: dayType?.newValue,
          startTime: startTime?.newValue,
          endTime: endTime?.newValue,
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
          handleCalendarChanges(
            selectedDays.map(({ date }) => ({
              date,
              dayType: DayType.SchoolDay,
            }))
          ),
      },
      {
        label: t('settings:schoolCalendar.setAsNonSchoolDay'),
        onClick: () =>
          handleCalendarChanges(
            selectedDays.map(({ date }) => ({
              date,
              dayType: DayType.Holiday,
            }))
          ),
      },
      {
        label: t('settings:schoolCalendar.changeStartAndEndTime'),
        onClick: onOpenModal,
      },
    ],
    [selectedDays]
  );

  const handleCalendarChanges = (days: Calendar_CreateCalendarDayInput[]) => {
    setEditedRows((prev) => ({
      ...(prev ?? {}),
      ...days
        .map((day) => {
          const previousDayChanges = prev[day.date] ?? {};

          Object.keys(day)
            .filter((key) => key !== 'date')
            .forEach((key) => {
              const newValue =
                day[
                  key as keyof Pick<
                    CalendarDayInfo,
                    'dayType' | 'startTime' | 'endTime'
                  >
                ];
              const oldValue = data?.dayInfo?.find(
                ({ date }) => date === day.date
              )?.[
                key as keyof Pick<
                  CalendarDayInfo,
                  'dayType' | 'startTime' | 'endTime'
                >
              ];

              if (!previousDayChanges[key]) {
                if (!isEqual(oldValue, newValue)) {
                  previousDayChanges[key] = {
                    originalValue: oldValue ?? null,
                    newValue: newValue ?? null,
                  };
                }
              } else {
                previousDayChanges[key].newValue = newValue;
              }

              if (
                isEqual(
                  previousDayChanges[key]?.originalValue,
                  newValue ?? null
                ) ||
                previousDayChanges[key] === undefined
              ) {
                delete previousDayChanges[key];
              }
              if (Object.keys(previousDayChanges).length === 0) {
                delete prev[key];
              }
            });

          return {
            ...previousDayChanges,
            date: day.date,
          } as Calendar_CreateCalendarDayInput;
        })
        .reduce((acc, { date, dayType, startTime, endTime }) => {
          if (
            date &&
            (dayType !== undefined ||
              startTime !== undefined ||
              endTime !== undefined)
          ) {
            acc[date] = {
              ...(dayType !== undefined ? { dayType } : {}),
              ...(startTime !== undefined ? { startTime } : {}),
              ...(endTime !== undefined ? { endTime } : {}),
            };
          }
          return acc;
        }, {} as any),
    }));
    setSelectedDays([]);
  };

  const handleChangeDayType = (
    event: React.MouseEvent<HTMLElement>,
    newType: DayType | 'All'
  ) => {
    if (newType !== null) {
      setDayTypeFilter(newType);
    }
  };

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
            <Stack direction="row" alignItems="center" gap={0.5} flex={1}>
              <CalendarDayTypeIcon style={{ fill: 'none' }} />
              <Typography variant="h4">
                {t('settings:schoolCalendar.dayTypes')}
              </Typography>
            </Stack>
            <ToggleButtonGroup
              value={dayTypeFilter}
              exclusive
              onChange={handleChangeDayType}
              aria-label="Day type"
              sx={{
                border: 'none',
                '.MuiToggleButtonGroup-grouped': {
                  borderWidth: '1px',
                  borderColor: '#E0E7FF !important',
                  borderStyle: 'solid',
                  mx: 1,
                },
                '.Mui-selected': {
                  borderColor: '#6366F1 !important',
                  backgroundColor: 'transparent !important',
                },
              }}
            >
              {dayTypes.map(({ label, color }, index) => (
                <ToggleButton
                  key={`day-type-${index}`}
                  value={label}
                  aria-label={label}
                  color="primary"
                >
                  {!!color && (
                    <Badge
                      sx={{
                        minWidth: 9,
                        minHeight: 9,
                        backgroundColor: color,
                        borderRadius: '50%',
                        mr: 0.5,
                      }}
                    />
                  )}
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
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
      {isCalendarDayInfoLoading || isUpdateCalendarDaysLoading ? (
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
              bellTimes={(data?.dayInfo ?? []).map((day) =>
                editedRows[day.date]
                  ? {
                      ...day,
                      dayType:
                        editedRows[day.date].dayType?.newValue ?? day.dayType,
                      startTime:
                        editedRows[day.date].startTime?.newValue ??
                        day.startTime,
                      endTime:
                        editedRows[day.date].endTime?.newValue ?? day.endTime,
                    }
                  : day
              )}
              dayTypeFilter={dayTypeFilter}
              activeAcademicNamespace={activeAcademicNamespace}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
          </Box>
          <ChangeDateRangeModal
            open={isModalOpen}
            onClose={onCloseModal}
            onSave={(startTime: Scalars['Time'], endTime: Scalars['Time']) => {
              handleCalendarChanges(
                selectedDays.map(({ date }) => ({
                  date,
                  dayType: DayType.SchoolDay,
                  startTime,
                  endTime,
                }))
              );
            }}
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
