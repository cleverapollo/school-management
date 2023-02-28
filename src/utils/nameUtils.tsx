import { Person } from "@tyro/api";

export const displayName  = (person: Pick<Person, 'firstName' | 'lastName'> | undefined): string => {
  if(person == null){
    return ""
  } else {
    return `${person.firstName} ${person.lastName}`
  }
};

