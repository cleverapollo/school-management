import {
  gqlClient,
  graphql,
  Notes_NotesFilter,
  Notes_TagCategory,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

export type ReturnTypeFromUseNotes = UseQueryReturnType<
  typeof useNotes
>[number];

const notes = graphql(/* GraphQL */ `
  query notes_notes($filter: Notes_NotesFilter!) {
    notes_notes(filter: $filter) {
      id
      note
      createdOn
      createdBy
      createdByPerson {
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
      }
      tags {
        id
        name
        category
        descriptionTextId
        nameTextId
      }
      priorityNote
      priorityStartDate
      priorityEndDate
    }
  }
`);

const notesQuery = (filter: Notes_NotesFilter) => {
  const updatedFilter = { ...filter, noteType: Notes_TagCategory.Note };

  return {
    queryKey: peopleKeys.students.notes(updatedFilter),
    queryFn: async () =>
      gqlClient.request(notes, {
        filter: updatedFilter,
      }),
  };
};

export function getNotes(filter: Notes_NotesFilter) {
  return queryClient.fetchQuery(notesQuery(filter));
}

export function useNotes(filter: Notes_NotesFilter, enabled = true) {
  return useQuery({
    ...notesQuery(filter),
    select: ({ notes_notes }) => notes_notes,
    enabled,
  });
}
