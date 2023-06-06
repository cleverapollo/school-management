import { ReturnTypeDisplayName, DisplayNamePersonProps } from '@tyro/core';

export function sortByDisplayName(
  displayName: ReturnTypeDisplayName,
  studentA: DisplayNamePersonProps,
  studentB: DisplayNamePersonProps
) {
  const nameA = displayName(studentA);
  const nameB = displayName(studentB);

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
}
