import { StudyLevel } from '@tyro/api';
import { TableSelect } from '@tyro/core';
import { TFunction } from '@tyro/i18n';

const studyLevels = [
  StudyLevel.Higher,
  StudyLevel.Ordinary,
  StudyLevel.Foundation,
  StudyLevel.Common,
  StudyLevel.NotApplicable,
];

export function StudyLevelSelectCellEditor(
  t: TFunction<'common'[], undefined, 'common'[]>
) {
  const options = studyLevels.map((studyLevel) => ({
    value: studyLevel,
    label: t(`common:studyLevel.${studyLevel}`),
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
