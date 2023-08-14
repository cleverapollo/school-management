import { Person } from '@tyro/api';

export type DisplayNamePersonProps =
  | Pick<Person, 'title' | 'firstName' | 'lastName' | 'type'>
  | undefined
  | null;

export enum PreferredNameFormat {
  'FirstnameSurname' = 'FIRST_NAME_SURNAME',
  'SurnameFirstname' = 'SURNAME_FIRST_NAME',
}

const displayName = (
  person: DisplayNamePersonProps,
  options?: {
    format: PreferredNameFormat;
  }
): string => {
  if (!person) {
    return '';
  }

  switch (options?.format) {
    case PreferredNameFormat.FirstnameSurname:
      return [person.firstName, person.lastName].filter(Boolean).join(' ');
    case PreferredNameFormat.SurnameFirstname:
    default:
      return [person.lastName, person.firstName].filter(Boolean).join(', ');
  }
};

const displayNames = (
  persons: DisplayNamePersonProps[] | undefined | null,
  separator = ', '
): string => {
  if (!persons) {
    return '';
  }
  return persons
    .map((person) => displayName(person))
    .filter(Boolean)
    .join(separator);
};

export function sortByDisplayName(
  studentA: DisplayNamePersonProps,
  studentB: DisplayNamePersonProps
) {
  const nameA = displayName(studentA);
  const nameB = displayName(studentB);

  return nameA.localeCompare(nameB);
}

export function searchDisplayName<T extends DisplayNamePersonProps>(
  options: T[],
  toSearch: string
) {
  if (!toSearch) return options;

  const splitInputValue = toSearch.toLowerCase().split(' ');

  return options.filter((option) => {
    const studentName = displayName(option).toLowerCase();
    return splitInputValue.every((string) => studentName.includes(string));
  });
}

export function usePreferredNameLayout() {
  return {
    displayName,
    displayNames,
    sortByDisplayName,
    searchDisplayName,
  };
}

export type ReturnTypeDisplayName = ReturnType<
  typeof usePreferredNameLayout
>['displayName'];

export type ReturnTypeDisplayNames = ReturnType<
  typeof usePreferredNameLayout
>['displayNames'];
