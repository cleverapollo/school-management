import { Person } from '@tyro/api';

export const displayName = (
  person: Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'> | undefined
): string => {
  if (person == null) {
    return '';
  }
  return `${person.firstName ?? ''} ${person.lastName ?? ''}`;
};

export const displayNames = (
  persons:
    | Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'>[]
    | undefined
): string => {
  if (persons == null) {
    return '';
  }
  return persons.map((person) => displayName(person))?.join(', ');
};

export function usePreferredNameLayout() {
  return {
    displayName,
    displayNames,
  };
}
