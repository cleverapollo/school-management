import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
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
    }
  }
`);

const notesQuery = (studentId: number | undefined) => ({
  queryKey: peopleKeys.students.notes(studentId),
  queryFn: async () =>
    gqlClient.request(notes, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getNotes(studentId: number | undefined) {
  return queryClient.fetchQuery(notesQuery(studentId));
}

export function useNotes(studentId: number | undefined) {
  return useQuery({
    ...notesQuery(studentId),
    select: ({ notes_notes }) => notes_notes,
  });
}