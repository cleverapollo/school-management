export function sortStartNumberFirst(a: string, b: string) {
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
