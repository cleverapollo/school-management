import { Person } from '@tyro/api';

export const displayName = (
  person:
    | Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'>
    | undefined
    | null
): string => {
  if (!person) {
    return '';
  }
  return `${person.firstName ?? ''} ${person.lastName ?? ''}`;
};

export const displayNames = (
  persons:
    | Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'>[]
    | undefined
    | null
): string => {
  if (!persons) {
    return '';
  }
  return persons
    .map((person) => displayName(person))
    .filter(Boolean)
    .join(', ');
};

export function usePreferredNameLayout() {
  return {
    displayName,
    displayNames,
  };
}
