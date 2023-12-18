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
} from '@tyro/api';
import { ActionMenu, useDisclosure } from '@tyro/core';
import { CalendarDayTypeIcon } from '@tyro/icons/src/calendar-day-type';
import { useState, useMemo } from 'react';
import * as React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { SchoolCalendar } from './calendar';
import { useCalendarDayInfo } from '../../api/school-calendar/calendar-day-info';
import { useUpdateCalendarDays } from '../../api/school-calendar/update-calendar-days';
import { ChangeDateRangeModal } from './change-date-range-modal';

dayjs.extend(LocalizedFormat);

export const CalendarOverview = () => {
  const { t } = useTranslation(['settings']);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const startDate = dayjs(activeAcademicNamespace?.startDate);
  const endDate = dayjs(activeAcademicNamespace?.endDate);
  const filter = {
    fromDate: startDate.format('YYYY-MM-DD'),
    toDate: endDate.format('YYYY-MM-DD'),
  };

  const { data: bellTimes = [], isLoading: isCalendarDayInfoLoading } =
    useCalendarDayInfo(filter);

  const {
    mutateAsync: updateCalendarDays,
    isLoading: isUpdateCalendarDaysLoading,
  } = useUpdateCalendarDays(filter);

  const [dayTypeFilter, setDayTypeFilter] = useState<DayType | 'All'>('All');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

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

  const handleUpdateCalendarDays = async (
    days: Calendar_CreateCalendarDayInput[]
  ) => {
    try {
      await updateCalendarDays({ days });
      setSelectedDays([]);
    } catch (e) {
      console.log(e);
    }
  };

  const actionMenuItems = useMemo(
    () => [
      {
        label: t('settings:schoolCalendar.setAsSchoolDay'),
        onClick: () =>
          handleUpdateCalendarDays(
            selectedDays.map((date) => ({
              date,
              dayType: DayType.SchoolDay,
            }))
          ),
      },
      {
        label: t('settings:schoolCalendar.setAsNonSchoolDay'),
        onClick: () =>
          handleUpdateCalendarDays(
            selectedDays.map((date) => ({
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

  const handleChangeDayType = (
    event: React.MouseEvent<HTMLElement>,
    newType: DayType | 'All'
  ) => {
    if (newType !== null) {
      setDayTypeFilter(newType);
    }
  };

  const handleChangeDateRange = (
    startTime: Scalars['Time'],
    endTime: Scalars['Time']
  ) => {};

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
              bellTimes={bellTimes}
              dayTypeFilter={dayTypeFilter}
              activeAcademicNamespace={activeAcademicNamespace}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
          </Box>
          <ChangeDateRangeModal
            open={isModalOpen}
            onClose={onCloseModal}
            onSave={handleChangeDateRange}
          />
        </CardContent>
      )}
    </Card>
  );
};
