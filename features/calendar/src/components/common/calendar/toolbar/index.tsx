/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { styled } from '@mui/material/styles';
import { Stack, Button, Typography, IconButton, Box } from '@mui/material';
// utils
import { useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  AddIcon,
  EditCalendarIcon,
} from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// hooks
// @types
import { CalendarView } from '../../../../types';
import { CalendarViewSwitcher } from './view-switcher';
// components

dayjs.extend(LocalizedFormat);

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

type Props = {
  date: Date;
  view: CalendarView;
  onEditCalendar: VoidFunction;
  onAddEvent: VoidFunction;
  onNextDate: VoidFunction;
  onPrevDate: VoidFunction;
  onChangeView: (newView: CalendarView) => void;
  hasMultipleResources?: boolean;
};

export function CalendarToolbar({
  date,
  view,
  onEditCalendar,
  onAddEvent,
  onNextDate,
  onPrevDate,
  onChangeView,
  hasMultipleResources = true,
}: Props) {
  const isDesktop = useResponsive('up', 'sm');
  const { t } = useTranslation(['calendar']);

  console.log({
    hasMultipleResources,
  });

  return (
    <RootStyle>
      {isDesktop && (
        <CalendarViewSwitcher
          value={view}
          onChange={onChangeView}
          hasMultipleResources={hasMultipleResources}
        />
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <ChevronLeftIcon />
        </IconButton>

        <Typography variant="body1">{dayjs(date).format('LL')}</Typography>

        <IconButton onClick={onNextDate}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={onEditCalendar}
          startIcon={<EditCalendarIcon sx={{ width: 20, height: 20 }} />}
        >
          {t('calendar:editCalendar')}
        </Button>
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={onAddEvent}
          startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
        >
          {t('calendar:addEvent')}
        </Button>
      </Stack>
    </RootStyle>
  );
}
