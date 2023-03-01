import { Person } from "@tyro/api";

export const displayName  = (person: Pick<Person, 'firstName' | 'lastName'> | undefined): string => {
  if(person == null){
    return ""
  } else {
    return `${person.firstName} ${person.lastName}`
  }
};

export const displayNames  = (persons: Pick<Person, 'firstName' | 'lastName'>[] | undefined): string => {
    if(persons == null){
        return ""
    } else {
        return persons.map(person => displayName(person))?.join(", ")
    }
};
