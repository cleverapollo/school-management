import { CommentType } from '@tyro/api';
import { TableSelect } from '@tyro/core';
import { TFunction } from '@tyro/i18n';

export function CommentTypeCellEditor(t: TFunction<'assessments'[]>) {
  const options = [
    {
      value: CommentType.FreeForm,
      label: t(`assessments:labels.commentTypes.FREE_FORM`),
    },
    {
      value: CommentType.CommentBank,
      label: t(`assessments:labels.commentTypes.COMMENT_BANK`),
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
        getOptionLabel: (option: (typeof options)[number]) => option.label,
      },
    } as const);
}
