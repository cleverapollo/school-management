import { Person } from '@tyro/api';

export type DisplayNamePersonProps =
  | Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'>
  | undefined
  | null;

const displayName = (
  person: DisplayNamePersonProps,
  options?: {
    format: 'fullName';
  }
): string => {
  if (!person) {
    return '';
  }

  switch (options?.format) {
    case 'fullName':
      return `${person.firstName ?? ''} ${person.lastName ?? ''}`;
    default:
      return `${person.lastName ?? ''}, ${person.firstName ?? ''}`;
  }
};

const displayNames = (
  persons: DisplayNamePersonProps[] | undefined | null
): string => {
  if (!persons) {
    return '';
  }
  return persons
    .map((person) => displayName(person))
    .filter(Boolean)
    .join(', ');
};

export function sortByDisplayName(
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

export function usePreferredNameLayout() {
  return {
    displayName,
    displayNames,
    sortByDisplayName,
  };
}

export type ReturnTypeDisplayName = ReturnType<
  typeof usePreferredNameLayout
>['displayName'];

export type ReturnTypeDisplayNames = ReturnType<
  typeof usePreferredNameLayout
>['displayNames'];
