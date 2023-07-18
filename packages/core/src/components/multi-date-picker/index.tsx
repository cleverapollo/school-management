import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { DatePicker, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useTranslation } from '@tyro/i18n';
import { MultiDatePickerDay } from './picker-day';
import { MultiDatePickerProps } from './types';
import { wasMultiSelectKeyUsed } from '../../utils';
import { dayKeyFormat } from './use-day-settings';
import { DatePickerPopper } from './popper';
import { useDisclosure } from '../../hooks';

export type { MultiDatePickerProps };

dayjs.extend(LocalizedFormat);
dayjs.extend(isSameOrBefore);

function arrayOfDatesBetween<TInputDate extends Dayjs>(
  date1: TInputDate,
  date2: TInputDate
): TInputDate[] {
  const dates = [];
  const start = date1.isBefore(date2) ? date1 : date2;
  const end = date1.isBefore(date2) ? date2 : date1;

  let currentDate = start.clone();

  while (currentDate.isSameOrBefore(end, 'day')) {
    dates.push(currentDate.clone());
    currentDate = currentDate.add(1, 'day');
  }

  return dates as TInputDate[];
}

export const MultiDatePicker = <TInputDate extends Dayjs>({
  value = [],
  onChange,
  ...props
}: MultiDatePickerProps<TInputDate>) => {
  const { t } = useTranslation(['common']);
  const lastSelectedDayRef = useRef<TInputDate>();
  const [rangePreviewDay, setRangePreviewDay] = useState<TInputDate>();
  const [showRangePreview, setShowRangePreview] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const valueMap = useMemo(
    () =>
      value.reduce<Map<string, TInputDate>>((acc, day) => {
        acc.set(day.format(dayKeyFormat), day);
        return acc;
      }, new Map()),
    [value]
  );

  const onDaySelect = useCallback(
    (event: React.MouseEvent, day: TInputDate) => {
      const newValueMap = new Map(valueMap);

      if (wasMultiSelectKeyUsed(event) && lastSelectedDayRef.current) {
        const arrayOfDatesBetweenLastAndCurrent = arrayOfDatesBetween(
          lastSelectedDayRef.current,
          day
        );
        const hasDayAlreadyBeenSelected = newValueMap.has(
          day.format(dayKeyFormat)
        );
        arrayOfDatesBetweenLastAndCurrent.forEach((d) => {
          if (hasDayAlreadyBeenSelected) {
            newValueMap.delete(d.format(dayKeyFormat));
          } else {
            newValueMap.set(d.format(dayKeyFormat), d);
          }
        });
      } else if (newValueMap.has(day.format(dayKeyFormat))) {
        newValueMap.delete(day.format(dayKeyFormat));
      } else {
        newValueMap.set(day.format(dayKeyFormat), day);
      }

      lastSelectedDayRef.current = day;

      onChange(Array.from(newValueMap.values()));
    },
    [valueMap]
  );

  const renderDay = useCallback(
    (pickersDayProps: PickersDayProps<TInputDate>) => (
      <MultiDatePickerDay
        {...pickersDayProps}
        pickerValue={valueMap}
        onDaySelect={onDaySelect}
        lastSelectedDayRef={lastSelectedDayRef}
        showRangePreview={showRangePreview}
        rangePreviewDay={rangePreviewDay}
        setRangePreviewDay={setRangePreviewDay}
      />
    ),
    [
      valueMap,
      onDaySelect,
      showRangePreview,
      rangePreviewDay,
      setRangePreviewDay,
    ]
  );

  useEffect(() => {
    const shiftKeyUpHandler = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShowRangePreview(false);
      }
    };
    const shiftKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShowRangePreview(true);
      }
    };
    window.addEventListener('keyup', shiftKeyUpHandler);
    window.addEventListener('keydown', shiftKeyDownHandler);

    return () => {
      window.removeEventListener('keyup', shiftKeyUpHandler);
      window.removeEventListener('keydown', shiftKeyDownHandler);
    };
  }, []);

  return (
    <DatePicker<TInputDate>
      {...props}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      slots={{
        day: renderDay,
        popper: DatePickerPopper,
      }}
      slotProps={{
        ...props.slotProps,
        popper: {
          ...props.slotProps?.popper,
          open: isOpen,
          sx: {
            '& .MuiDayCalendar-weekContainer': {
              my: '1px',
            },
          },
          onMouseLeave: () => {
            setRangePreviewDay(undefined);
          },
        },
        field: {
          readOnly: true,
        },
        textField: {
          ...props.slotProps?.textField,
          onClick: onOpen,
          InputProps: {
            value:
              value?.length > 0
                ? t('common:dateAndXOthers', {
                    date: value[0].format('L'),
                    count: value.length - 1,
                  })
                : '',
          },
        },
      }}
    />
  );
};
