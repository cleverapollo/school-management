import { Person } from '@tyro/api';
import { displayName, PreferredNameFormat } from '../hooks';
import {
  getBaseColorBasedOnString,
  getColorBasedOnString,
} from './get-color-based-on-string';

type PersonName = Pick<Person, 'firstName' | 'lastName'>;

export function getColorBasedOnPerson(person?: PersonName) {
  return getColorBasedOnString(
    displayName(person, {
      format: PreferredNameFormat.SurnameFirstname,
    })
  );
}

export function getBaseColorBasedOnPerson(person?: PersonName) {
  return getBaseColorBasedOnString(
    displayName(person, {
      format: PreferredNameFormat.SurnameFirstname,
    })
  );
}
