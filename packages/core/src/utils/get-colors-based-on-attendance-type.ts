import { AttendanceCodeType } from '@tyro/api';

interface AttendanceCode {
  codeType: AttendanceCodeType;
}

export const getColourBasedOnAttendanceType = (
  attendanceCode: AttendanceCode['codeType']
) => {
  const colors = { color: '', backgroundColor: '' };
  switch (attendanceCode) {
    case AttendanceCodeType.Present:
      colors.color = `emerald.500`;
      colors.backgroundColor = `emerald.100`;
      break;
    case AttendanceCodeType.ExplainedAbsence:
      colors.color = `pink.600`;
      colors.backgroundColor = `pink.100`;
      break;
    case AttendanceCodeType.UnexplainedAbsence:
      colors.color = `violet.700`;
      colors.backgroundColor = `violet.100`;
      break;
    case AttendanceCodeType.Late:
      colors.color = `sky.500`;
      colors.backgroundColor = `sky.100`;
      break;

    default:
  }
  return colors;
};
