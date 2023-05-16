import { TableSelect } from '@tyro/core';

type Periods = { period: number };

export const availablePeriods = Array.from(
  { length: 12 },
  (_, index) => index + 1
);
const periods: Periods[] = availablePeriods.map((periodIndex) => ({
  period: periodIndex,
}));

export function PeriodSelector() {
  const options = periods.map((period) => ({
    value: period?.period,
    label: period?.period,
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
