import { TableSelect } from '@tyro/core';

export function PeriodSelector() {
  const availablePeriods = Array.from({ length: 12 }, (_, index) => index + 1);
  const options = availablePeriods.map((index) => ({
    value: index,
    label: index,
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
