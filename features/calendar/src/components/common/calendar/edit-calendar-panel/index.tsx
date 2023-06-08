import {
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
} from '@mui/material';
import { CalendarEventType } from '@tyro/api';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from '@tyro/i18n';
import { CalendarSearch, CalendarSearchProps } from './calendar-search';

interface FilterCalendarPanelProps extends CalendarSearchProps {
  isOpen: boolean;
  visableEventTypes: CalendarEventType[];
  setVisableEventTypes: Dispatch<SetStateAction<CalendarEventType[]>>;
}

export function FilterCalendarPanel({
  isOpen,
  selectedPartys,
  onChangeSelectedPartys,
  visableEventTypes,
  setVisableEventTypes,
}: FilterCalendarPanelProps) {
  const { t } = useTranslation(['calendar']);

  const toggleVisableEventType = (
    toggledType: CalendarEventType,
    checked: boolean
  ) => {
    if (checked) {
      setVisableEventTypes((previousTypes) => [...previousTypes, toggledType]);
    } else {
      setVisableEventTypes((previousTypes) =>
        previousTypes.filter((type) => type !== toggledType)
      );
    }
  };

  return (
    <Collapse orientation="horizontal" in={isOpen}>
      <Stack
        sx={{
          width: 280,
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          p: 2,
          pt: 4,
          overflowY: 'auto',
        }}
      >
        <CalendarSearch
          selectedPartys={selectedPartys}
          onChangeSelectedPartys={onChangeSelectedPartys}
        />
        <FormControl sx={{ mt: 2 }} component="fieldset" variant="standard">
          <FormLabel component="legend">{t('calendar:eventTypes')}</FormLabel>
          <FormGroup>
            {Object.values(CalendarEventType).map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={visableEventTypes.includes(type)}
                    onChange={(_, checked) => {
                      toggleVisableEventType(type, checked);
                    }}
                    name={type}
                  />
                }
                label={t(`calendar:calendarEventTypes.${type}`)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Stack>
    </Collapse>
  );
}
