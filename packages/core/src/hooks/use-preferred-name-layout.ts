import { Person } from '@tyro/api';

const displayName = (
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

const displayNames = (
  persons:
    | (Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'> | null)[]
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

export type ReturnTypeDisplayName = ReturnType<
  typeof usePreferredNameLayout
>['displayName'];

export type ReturnTypeDisplayNames = ReturnType<
  typeof usePreferredNameLayout
>['displayNames'];
