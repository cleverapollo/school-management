import { TableSelect } from '@tyro/core';
import { priorityOptions } from './contact-form/student-relationships';

const options = priorityOptions.map((option) => ({
  value: option,
  label: String(option),
}));

export function PriorityTypeCellEditor() {
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
