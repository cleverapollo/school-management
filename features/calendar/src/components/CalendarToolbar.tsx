/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { styled } from '@mui/material/styles';
import {
  Stack,
  Button,
  Tooltip,
  Typography,
  IconButton,
  ToggleButton,
  Box,
} from '@mui/material';
// utils
import { useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  Calendar22Icon,
  CalendarDatesIcon,
  CalendarMonthIcon,
  CalendarScheduleIcon,
} from '@tyro/icons';
import { fDate } from '../../../../src/utils/formatTime';
// hooks
// @types
import { CalendarView } from '../types';
// components
import { Iconify } from '../../../../src/components/iconify';

const VIEW_OPTIONS = [
  { value: 'timeGridDay', label: 'Day', icon: Calendar22Icon },
  { value: 'timeGridWeek', label: 'Week', icon: CalendarDatesIcon },
  { value: 'dayGridMonth', label: 'Month', icon: CalendarMonthIcon },
  { value: 'listWeek', label: 'Agenda', icon: CalendarScheduleIcon },
  {
    value: 'resourceTimelineDay',
    label: 'Timeline',
    icon: CalendarScheduleIcon,
  },
] as const;

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  date: Date;
  view: CalendarView;
  onToday: VoidFunction;
  onNextDate: VoidFunction;
  onPrevDate: VoidFunction;
  onChangeView: (newView: CalendarView) => void;
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
}: Props) {
  const isDesktop = useResponsive('up', 'sm');
  const { t } = useTranslation(['calendar']);

  return (
    <RootStyle>
      {isDesktop && (
        <Stack
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
          {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value} title={label}>
              <ToggleButton
                value={view}
                selected={value === view}
                onChange={() => onChangeView(value)}
                sx={{ width: 32, height: 32, padding: 0, border: 0 }}
              >
                <Icon sx={{ width: 20, height: 20 }} />
              </ToggleButton>
            </Tooltip>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
        </IconButton>

        <Typography variant="body1">{fDate(date)}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} height={20} />
        </IconButton>
      </Stack>

      {isDesktop && (
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={onToday}
        >
          {t('calendar:today')}
        </Button>
      )}
    </RootStyle>
  );
}
