import { AttendanceCodeType } from '@tyro/api';

interface AttendanceCodeChipProps {
  codeType: AttendanceCodeType;
}

export const getColourBasedOnAttendanceType = (
  attendanceCode: AttendanceCodeChipProps['codeType']
) => {
  const colors = { colour: '', backGroundColor: '' };
  switch (attendanceCode) {
    case AttendanceCodeType.Present:
      colors.colour = `emerald.500`;
      colors.backGroundColor = `emerald.100`;
      break;
    case AttendanceCodeType.ExplainedAbsence:
      colors.colour = `pink.600`;
      colors.backGroundColor = `pink.100`;
      break;
    case AttendanceCodeType.Late:
      colors.colour = `sky.500`;
      colors.backGroundColor = `sky.100`;
      break;
    case AttendanceCodeType.UnexplainedAbsence:
      colors.colour = `violet.700`;
      colors.backGroundColor = `violet.100`;
      break;
    default:
  }
  return colors;
};
