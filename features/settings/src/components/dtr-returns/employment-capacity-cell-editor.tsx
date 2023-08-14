import { TableSelect } from '@tyro/core';
import {
  EmploymentCapacityOption,
  useEmploymentCapacities,
} from '@tyro/people/src/api/staff/employment-capacities';

export function EmploymentCapacitySelectCellEditor(
  capacitiesData: EmploymentCapacityOption[]
) {
  const options = capacitiesData?.map((capacity) => ({
    value: capacity,
    label: capacity.name,
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
