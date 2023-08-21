import { Gender } from '@tyro/api';
import { TFunction } from '@tyro/i18n';
import { TableSelect } from './select';

const genders = Object.values(Gender);

export function GenderSelectCellEditor(
  translate: TFunction<'people'[], undefined, 'people'[]>
) {
  const options = genders.map((gender) => ({
    value: gender,
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
        getOptionLabel: (option: (typeof options)[number]) =>
          translate(`people:gender.${option.label}`),
      },
    } as const);
}
