import { Notes_BehaviourType } from '@tyro/api';
import { TFunction } from '@tyro/i18n';
import { TableSelect } from './select';

const behaviourTypes = [
  Notes_BehaviourType.Positive,
  Notes_BehaviourType.Neutral,
  Notes_BehaviourType.Negative,
];

export function BehaviourLabelSelectCellEditor(
  t: TFunction<'common'[], undefined, 'common'[]>
) {
  const options = behaviourTypes.map((behaviourType) => ({
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
