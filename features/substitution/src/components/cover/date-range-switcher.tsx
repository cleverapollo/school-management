import { Button, Popover } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  useDisclosure,
  DateRangeCalendar,
  DateRangeCalendarProps,
} from '@tyro/core';
import { useRef } from 'react';
import { useTranslation } from '@tyro/i18n';

dayjs.extend(LocalizedFormat);

interface DateRangeSwitcherProps {
  dateRange: DateRangeCalendarProps<Dayjs>['value'];
  onChangeRange: DateRangeCalendarProps<Dayjs>['onChange'];
}

export function DateRangeSwitcher({
  dateRange,
  onChangeRange,
}: DateRangeSwitcherProps) {
  const { t } = useTranslation(['common']);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const { id, isOpen, onClose, getButtonProps } = useDisclosure();

  return (
    <>
      <Button
        ref={dateButtonRef}
        variant="text"
        color="inherit"
        sx={{ fontWeight: 600 }}
        {...getButtonProps()}
      >
        {dateRange
          ? `${dateRange[0].format('LL')} - ${dateRange[1].format('LL')}`
          : t('common:selectDateRange')}
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
        <DateRangeCalendar
          value={dateRange}
          onChange={(newValue) => {
            if (newValue) {
              onChangeRange(newValue);
            }
          }}
        />
      </Popover>
    </>
  );
}
