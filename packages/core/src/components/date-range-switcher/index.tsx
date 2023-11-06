import { Button, Popover } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRef } from 'react';
import { useTranslation } from '@tyro/i18n';
import { useDisclosure } from '../../hooks';
import {
  DateRangeCalendar,
  DateRangeCalendarProps,
} from '../date-range-calendar';

dayjs.extend(LocalizedFormat);

export function DateRangeSwitcher(props: DateRangeCalendarProps<Dayjs>) {
  const { t } = useTranslation(['common']);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const { id, isOpen, onClose, getButtonProps } = useDisclosure();

  const { value } = props;

  return (
    <>
      <Button
        ref={dateButtonRef}
        variant="text"
        color="inherit"
        sx={{ fontWeight: 600 }}
        {...getButtonProps()}
      >
        {value
          ? `${value[0].format('LL')} - ${value[1].format('LL')}`
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
        <DateRangeCalendar {...props} />
      </Popover>
    </>
  );
}
