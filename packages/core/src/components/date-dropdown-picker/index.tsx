import { useRef } from 'react';
import { Button, ButtonProps as MUIButtonProps, Popover } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import { useTranslation } from '@tyro/i18n';
import { ChevronDownIcon } from '@tyro/icons';
import { useDisclosure } from '../../hooks/use-disclosure';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

interface DateSwitcherProps {
  date: Dayjs;
  onChangeDate: (date: Dayjs) => void;
  ButtonProps?: MUIButtonProps;
}

export function DateDropdownPicker({
  date,
  onChangeDate,
  ButtonProps,
}: DateSwitcherProps) {
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const { isOpen, id, onClose, getButtonProps } = useDisclosure();
  const { t } = useTranslation(['calendar']);

  const formattedDate = date.calendar(null, {
    sameDay: `[${t('calendar:today')}]`,
    nextDay: `[${t('calendar:tomorrow')}]`,
    nextWeek: 'dddd',
    lastDay: `[${t('calendar:yesterday')}]`,
    lastWeek: `[${t('calendar:dayOfLastWeek', { day: date.format('dddd') })}]`,
    sameElse: 'l',
  });

  return (
    <>
      <Button
        ref={dateButtonRef}
        variant="soft"
        endIcon={<ChevronDownIcon />}
        {...ButtonProps}
        {...getButtonProps()}
      >
        {formattedDate}
      </Button>
      <Popover
        open={isOpen}
        id={id}
        onClose={onClose}
        anchorEl={dateButtonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <DateCalendar
          value={date}
          onChange={(newValue) => {
            if (newValue) {
              onChangeDate(newValue);
              onClose();
            }
          }}
        />
      </Popover>
    </>
  );
}
