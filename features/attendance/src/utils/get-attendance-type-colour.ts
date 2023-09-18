export const getColourBasedOnAttendanceType = (
  attendanceColor: 'emerald' | 'pink' | 'sky' | 'violet'
) => {
  let colour;
  switch (attendanceColor) {
    case 'emerald':
      colour = `${attendanceColor}.500`;
      break;
    case 'pink':
      colour = `${attendanceColor}.500`;
      break;
    case 'sky':
      colour = `${attendanceColor}.400`;
      break;
    case 'violet':
      colour = `${attendanceColor}.700`;
      break;
    default:
  }
  return colour;
};
