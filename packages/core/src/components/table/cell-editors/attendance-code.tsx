import { AttendanceCodeType } from '@tyro/api';
import { TFunction } from '@tyro/i18n';
import { TableSelect } from './select';

const attendanceCodes = [
  AttendanceCodeType.Present,
  AttendanceCodeType.Late,
  AttendanceCodeType.ExplainedAbsence,
  AttendanceCodeType.UnexplainedAbsence,
];

export function AttendanceCodeSelectCellEditor(
  t: TFunction<'common'[], undefined, 'common'[]>
) {
  const options = attendanceCodes.map((attendanceCode) => ({
    value: attendanceCode,
    label: t(`common:attendanceCode.${attendanceCode}`),
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
