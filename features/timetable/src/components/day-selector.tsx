import { TableSelect } from '@tyro/core';
import dayjs from 'dayjs';

const availableDays = Array.from({ length: 5 }, (_, index) => index + 1);
const options = availableDays.map((dayIndex) => ({
  label: dayjs().day(dayIndex).format('dddd'),
  value: dayIndex,
}));

export function DaySelector() {
  return () =>
    ({
      component: TableSelect<(typeof options)[number]>,
      popup: true,
      popupPosition: 'under',
      params: {
        options,
        optionIdKey: 'value',
        getOptionLabel: (option: (typeof options)[number]) => option.label,
      },
    } as const);
}
