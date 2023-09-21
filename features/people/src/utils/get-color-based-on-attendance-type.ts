import { AttendanceCodeType } from '@tyro/api';

interface AttendanceCode {
  codeType: AttendanceCodeType;
}

export const defaultCalendarDayColors = {
  backgroundColor: 'transparent',
  color: 'slate.500',
  backgroundColorHoverState: 'transparent',
  colorHoverState: 'slate.500',
};

export const getColourBasedOnAttendanceType = (
  attendanceCode: AttendanceCode['codeType']
) => {
  const defaultColors = {
    ...defaultCalendarDayColors,
    color: '#FFFFFF',
    colorHoverState: '#FFFFFF',
  };

  switch (attendanceCode) {
    case AttendanceCodeType.Present:
      defaultColors.backgroundColor = `emerald.500`;
      defaultColors.backgroundColorHoverState = `emerald.700`;
      break;

    case AttendanceCodeType.ExplainedAbsence:
      defaultColors.backgroundColor = `pink.500`;
      defaultColors.backgroundColorHoverState = `pink.600`;
      break;

    case AttendanceCodeType.UnexplainedAbsence:
      defaultColors.backgroundColor = `violet.700`;
      defaultColors.backgroundColorHoverState = `violet.900`;
      break;

    case AttendanceCodeType.Late:
      defaultColors.backgroundColor = `sky.400`;
      defaultColors.backgroundColorHoverState = `sky.600`;
      break;

    case AttendanceCodeType.NotTaken:
      defaultColors.backgroundColor = `zinc.300`;
      defaultColors.color = `zinc.700`;
      defaultColors.backgroundColorHoverState = `zinc.400`;
      defaultColors.colorHoverState = `zinc.700`;
      break;

    default:
  }
  return defaultColors;
};
