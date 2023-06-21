export function sortStartNumberFirst(
  a: string | undefined,
  b: string | undefined
) {
  if (a === undefined && b === undefined) {
    return 0;
  }
  if (a === undefined || b === undefined) {
    return a === undefined ? 1 : -1;
  }

  const intAtStartOfA = parseInt(a, 10);
  const intAtStartOfB = parseInt(b, 10);

  if (
    !Number.isNaN(intAtStartOfA) &&
    !Number.isNaN(intAtStartOfB) &&
    intAtStartOfA !== intAtStartOfB
  ) {
    return intAtStartOfA - intAtStartOfB;
  }

  return a.localeCompare(b);
}
