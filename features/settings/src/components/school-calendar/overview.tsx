import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { DayType, useAcademicNamespace } from '@tyro/api';
import { CalendarDayTypeIcon } from '@tyro/icons/src/calendar-day-type';
import { useState } from 'react';
import * as React from 'react';
import { VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { SchoolCalendar } from './calendar';
import { useCalendarDayInfo } from '../../api/school-calendar/calendar-day-info';

dayjs.extend(LocalizedFormat);

export const CalendarOverview = () => {
  const { t } = useTranslation(['settings']);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const startDate = dayjs(activeAcademicNamespace?.startDate);
  const endDate = dayjs(activeAcademicNamespace?.endDate);

  const { data: bellTimes = [], isLoading: isBellTimesLoading } =
    useCalendarDayInfo({
      fromDate: startDate.format('YYYY-MM-DD'),
      toDate: endDate.format('YYYY-MM-DD'),
    });

  const [dayType, setDayType] = useState<DayType | 'All'>('All');

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
      color: 'purple.400',
    },
  ];

  const handleChangeDayType = (
    event: React.MouseEvent<HTMLElement>,
    newType: DayType | 'All'
  ) => {
    if (newType !== null) {
      setDayType(newType);
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
              value={dayType}
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
            <Stack direction="row" justifyContent="flex-end" flex={1}>
              <IconButton>
                <VerticalDotsIcon />
              </IconButton>
            </Stack>
          </Stack>
        }
      />
      {isBellTimesLoading ? (
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
              dayType={dayType}
              activeAcademicNamespace={activeAcademicNamespace}
            />
          </Box>
        </CardContent>
      )}
    </Card>
  );
};
