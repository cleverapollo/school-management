export function getNumber(number: any) {
  return Number.isNaN(Number(number)) ? undefined : Number(number);
}

/**
 * This hook is used to convert a string to a number and can be good to use
 * with react router's useParams hook as that always returns a string.
 */
export function useNumber(number: any) {
  return getNumber(number);
}
