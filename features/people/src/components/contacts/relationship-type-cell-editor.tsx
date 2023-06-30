import { StudentContactType } from '@tyro/api';
import { TableSelect } from '@tyro/core';
import { TFunction } from '@tyro/i18n';

export function RelationshipTypeCellEditor(t: TFunction<'common'[]>) {
  const options = Object.values(StudentContactType).map((option) => ({
    value: option,
    label: t(`common:relationshipType.${option}`),
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
