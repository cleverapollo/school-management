import { PartyPersonType, Person } from '../gql/graphql';

export function getPersonProfileLink(
  person: Pick<Person, 'type' | 'partyId'> | undefined
) {
  switch (person?.type) {
    case PartyPersonType.Student:
      return `/people/students/${person.partyId}`;
    case PartyPersonType.Staff:
      return `/people/staff/${person.partyId}`;
    case PartyPersonType.Contact:
      return `/people/contacts/${person.partyId}`;
    default:
      return null;
  }
}
