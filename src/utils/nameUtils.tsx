import { Person } from "@tyro/api";

export const displayName  = (person: Person | undefined) => {
  if(person == null){
    return ""
  } else {
    return `${person.firstName} ${person.lastName}`
  }
};

