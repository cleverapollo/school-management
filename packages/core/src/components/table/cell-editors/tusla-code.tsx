import { TuslaCode } from '@tyro/api';
import { TableSelect } from './select';

const tuslaCodes = [...Object.keys(TuslaCode)];

export function TuslaCodeSelectCellEditor() {
  const options = tuslaCodes.map((tuslaCode) => ({
    value: tuslaCode,
    label: tuslaCode,
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
