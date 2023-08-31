import { Notes_BehaviourType } from '@tyro/api';
import { TFunction } from '@tyro/i18n';
import { TableSelect } from './select';

export function BehaviourLabelSelectCellEditor(
  t: TFunction<'common'[], undefined, 'common'[]>
) {
  const options = Object.values(Notes_BehaviourType).map((behaviourType) => ({
    value: behaviourType,
    label: t(`common:behaviourType.${behaviourType}`),
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
