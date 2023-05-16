import { TableSelect } from '@tyro/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';

type DayOfWeek = { day?: string; id?: number };

export const availableDays = Array.from({ length: 5 }, (_, index) => index + 1);
const daysOfWeek: DayOfWeek[] = availableDays.map((dayIndex) => ({
  day: dayjs().day(dayIndex).format('dddd'),
  id: dayIndex,
}));

export function DaySelector() {
  const options = daysOfWeek.map((day) => ({
    value: day?.id,
    label: day?.day,
  }));

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
