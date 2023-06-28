import { Gender, Person } from '@tyro/api';

type ListManagerPerson = Pick<
  Person,
  'partyId' | 'title' | 'firstName' | 'lastName' | 'avatarUrl' | 'type'
>;

export type ListManagerStudent = {
  id: string;
  isDuplicate?: boolean;
  classGroupName?: string | null | undefined;
  gender?: Gender | null;
  person: ListManagerPerson;
};

export interface ListManagerGroup {
  partyId: number;
  name: string;
  students: ListManagerStudent[];
  staff?: ListManagerPerson[];
}

export interface ListManagerState {
  id: 'unassigned' | number;
  name: string;
  students: ListManagerStudent[];
  staff?: ListManagerPerson[];
}
