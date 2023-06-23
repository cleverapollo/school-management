// Determines if the platform specific toggle selection in group key was used
export const wasToggleInSelectionGroupKeyUsed = (
  event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
) => {
  const isUsingWindows = navigator.platform.includes('Win');
  return isUsingWindows ? event.ctrlKey : event.metaKey;
};

// Determines if the multiSelect key was used
export const wasMultiSelectKeyUsed = (
  event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
) => event.shiftKey;
