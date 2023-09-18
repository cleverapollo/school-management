export const defaultColors = {
  backgroundColor: 'transparent',
  color: 'slate.500',
  backgroundColorHoverState: 'transparent',
  colorHoverState: 'slate.500',
};

export const getColourBasedOnAttendanceType = (
  keyOfAttendanceColors: string
) => {
  const defaultColorsWithAttendance = {
    ...defaultColors,
    color: '#FFFFFF',
    colorHoverState: '#FFFFFF',
  };

  switch (keyOfAttendanceColors) {
    case 'emerald':
      defaultColorsWithAttendance.backgroundColor = `${keyOfAttendanceColors}.500`;
      defaultColorsWithAttendance.backgroundColorHoverState = `${keyOfAttendanceColors}.700`;
      break;

    case 'pink':
      defaultColorsWithAttendance.backgroundColor = `${keyOfAttendanceColors}.500`;
      defaultColorsWithAttendance.backgroundColorHoverState = `${keyOfAttendanceColors}.600`;
      break;

    case 'violet':
      defaultColorsWithAttendance.backgroundColor = `${keyOfAttendanceColors}.700`;
      defaultColorsWithAttendance.backgroundColorHoverState = `${keyOfAttendanceColors}.900`;
      break;

    case 'sky':
      defaultColorsWithAttendance.backgroundColor = `${keyOfAttendanceColors}.400`;
      defaultColorsWithAttendance.backgroundColorHoverState = `${keyOfAttendanceColors}.600`;
      break;

    case 'zinc':
      defaultColorsWithAttendance.backgroundColor = `${keyOfAttendanceColors}.300`;
      defaultColorsWithAttendance.color = `${keyOfAttendanceColors}.700`;
      defaultColorsWithAttendance.backgroundColorHoverState = `${keyOfAttendanceColors}.400`;
      defaultColorsWithAttendance.colorHoverState = `${keyOfAttendanceColors}.700`;
      break;

    default:
  }
  return defaultColorsWithAttendance;
};
