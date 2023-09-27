export const isApple = () => {
  const expression = /(Mac|iPhone|iPod|iPad)/i;
  return expression.test(navigator.platform);
};

export const getMetaCharacter = () => (isApple() ? '⌘' : 'Ctrl');

// Determines if the platform specific toggle selection in group key was used
export const wasToggleInSelectionGroupKeyUsed = (
  event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
) => (isApple() ? event.metaKey : event.ctrlKey);

// Determines if the multiSelect key was used
export const wasMultiSelectKeyUsed = (
  event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
) => event.shiftKey;
