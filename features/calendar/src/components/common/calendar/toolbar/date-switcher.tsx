import { Button, IconButton, Popover, Stack } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { ChevronLeftIcon, ChevronRightIcon } from '@tyro/icons';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useDisclosure } from '@tyro/core';
import { useRef } from 'react';
import { useTranslation } from '@tyro/i18n';

dayjs.extend(LocalizedFormat);

interface DateSwitcherProps {
  onPreviousDateClick: () => void;
  onNextDateClick: () => void;
  date: Dayjs;
  onChangeDate: (date: Dayjs) => void;
}

export function DateSwitcher({
  onPreviousDateClick,
  onNextDateClick,
  date,
  onChangeDate,
}: DateSwitcherProps) {
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const { isOpen, id, onClose, getButtonProps } = useDisclosure();
  const { t } = useTranslation(['common', 'calendar']);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <IconButton
        onClick={onPreviousDateClick}
        aria-label={t('common:actions.previous')}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Button
        ref={dateButtonRef}
        variant="text"
        color="inherit"
        sx={{ fontWeight: 600 }}
        {...getButtonProps()}
      >
        {date.format('LL')}
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

      <IconButton
        onClick={onNextDateClick}
        aria-label={t('common:actions.next')}
      >
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  );
}
