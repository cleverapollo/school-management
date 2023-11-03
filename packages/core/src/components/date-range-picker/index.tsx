import { IconButton, Popover, TextField, TextFieldProps } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useEffect, useRef } from 'react';
import { useTranslation } from '@tyro/i18n';
import { CalendarMonthAltIcon, CloseIcon } from '@tyro/icons';
import {
  DateRangeCalendar,
  DateRangeCalendarProps,
} from '../date-range-calendar';
import { useDisclosure, useMergeRefs } from '../../hooks';

dayjs.extend(LocalizedFormat);

type DateRangePickerProps = {
  label?: string;
  textFieldProps?: TextFieldProps;
  dateRange: DateRangeCalendarProps<Dayjs>['value'];
  onChangeRange: (value: DateRangeCalendarProps<Dayjs>['value']) => void;
};

export function DateRangePicker({
  label,
  textFieldProps,
  dateRange,
  onChangeRange,
}: DateRangePickerProps) {
  const { t } = useTranslation(['common']);

  const inputRef = useRef<HTMLInputElement>(null);
  const refs = useMergeRefs(textFieldProps?.inputRef, inputRef);
  const { id, getButtonProps, onClose, isOpen, onOpen } = useDisclosure();
  const inputProps = getButtonProps() as unknown as TextFieldProps;

  const hasValue = dateRange && dateRange.length === 2;

  useEffect(() => {
    if (!isOpen) {
      inputRef.current?.blur();
    }
  }, [isOpen]);

  return (
    <>
      <TextField
        {...inputProps}
        {...textFieldProps}
        inputRef={refs}
        value={
          hasValue
            ? `${dateRange[0].format('ll')} - ${dateRange[1].format('ll')}`
            : ''
        }
        label={label || t('common:selectDateRange')}
        InputProps={{
          onKeyDown: (ev) => {
            if (ev.key === 'Enter' || ev.code === 'Space') {
              onOpen();
            }
          },
          endAdornment: hasValue ? (
            <IconButton
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                onChangeRange(undefined);
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton>
              <CalendarMonthAltIcon />
            </IconButton>
          ),
        }}
      />
      <Popover
        open={isOpen}
        id={id}
        onClose={onClose}
        anchorEl={inputRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <DateRangeCalendar
          value={dateRange}
          autoFocus
          onChange={(newValue) => {
            onChangeRange(newValue);

            if (!newValue?.[1]?.isSame(dateRange?.[1])) {
              onClose();
            }
          }}
        />
      </Popover>
    </>
  );
}
