import { SubjectGroupStudentMembershipTypeEnum } from '@tyro/api';
import { TableSelect } from '@tyro/core';
import { TFunction } from '@tyro/i18n';

export function SubjectGroupTypeCellEditor(t: TFunction<'groups'[]>) {
  const options = [
    {
      value: SubjectGroupStudentMembershipTypeEnum.Block,
    },
    {
      value: SubjectGroupStudentMembershipTypeEnum.Core,
    },
    {
      value: SubjectGroupStudentMembershipTypeEnum.Freeform,
    },
    {
      value: SubjectGroupStudentMembershipTypeEnum.Unknown,
    },
  ];

  return () =>
    ({
      component: TableSelect<(typeof options)[number]>,
      popup: true,
      popupPosition: 'under',
      params: {
        options,
        optionIdKey: 'value',
        getOptionLabel: (option: (typeof options)[number]) =>
          t(`groups:subjectGroupStudentMembershipType.${option.value}`),
      },
    } as const);
}
