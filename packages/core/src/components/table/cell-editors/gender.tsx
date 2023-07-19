import { Gender } from '@tyro/api';
import { TableSelect } from './select';

const genders = [...Object.keys(Gender)];

export function GenderSelectCellEditor() {
  const options = genders.map((gender) => ({
    value: gender.toUpperCase(),
    label: gender,
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
