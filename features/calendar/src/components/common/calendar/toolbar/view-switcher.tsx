import { Divider, Fade, Stack, ToggleButton, Tooltip } from '@mui/material';

import {
  Calendar22Icon,
  CalendarDatesIcon,
  CalendarMonthIcon,
  CalendarScheduleIcon,
  CalendarTimelineIcon,
  CalendarVerticalIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

const VIEW_OPTIONS = [
  { value: 'timeGridDay', label: 'Day', icon: Calendar22Icon },
  { value: 'timeGridWeek', label: 'Week', icon: CalendarDatesIcon },
  { value: 'dayGridMonth', label: 'Month', icon: CalendarMonthIcon },
  { value: 'listWeek', label: 'Schedule', icon: CalendarScheduleIcon },
  {
    value: 'resourceTimelineDay',
    label: 'Horizontal Timeline',
    icon: CalendarTimelineIcon,
  },
  {
    value: 'resourceTimeGridDay',
    label: 'Vertical Timeline',
    icon: CalendarVerticalIcon,
  },
] as const;

type ViewOption = (typeof VIEW_OPTIONS)[number];

interface CalendarToggleButtonProps {
  value: ViewOption['value'];
  label: ViewOption['label'];
  icon: ViewOption['icon'];
  selected: boolean;
  onChange: (value: ViewOption['value']) => void;
}

function CalendarToggleButton({
  value,
  label,
  icon: Icon,
  selected,
  onChange,
}: CalendarToggleButtonProps) {
  return (
    <Tooltip title={label}>
      <ToggleButton
        value={value}
        selected={selected}
        onChange={() => onChange(value)}
        sx={{ width: 32, height: 32, padding: 0, border: 0 }}
      >
        <Icon sx={{ width: 20, height: 20 }} />
      </ToggleButton>
    </Tooltip>
  );
}

interface CalendarViewSwitcherProps {
  value: ViewOption['value'];
  onChange: (value: ViewOption['value']) => void;
  hasMultipleResources: boolean;
}

export function CalendarViewSwitcher({
  value,
  onChange,
  hasMultipleResources,
}: CalendarViewSwitcherProps) {
  const { t } = useTranslation(['calendar']);

  return (
    <Stack
      role="group"
      aria-label={t('calendar:changeCalendarView')}
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
      {VIEW_OPTIONS.slice(0, 4).map((props) => (
        <CalendarToggleButton
          key={props.value}
          {...props}
          selected={props.value === value}
          onChange={onChange}
        />
      ))}
      <Fade in={hasMultipleResources}>
        <Stack direction="row" spacing={1}>
          <Divider orientation="vertical" />
          {VIEW_OPTIONS.slice(4, 6).map((props) => (
            <CalendarToggleButton
              key={props.value}
              {...props}
              selected={props.value === value}
              onChange={onChange}
            />
          ))}
        </Stack>
      </Fade>
    </Stack>
  );
}
