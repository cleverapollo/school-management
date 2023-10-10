import {
  gqlClient,
  graphql,
  Notes_TagCategory,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

export type ReturnTypeFromUseBehaviours = UseQueryReturnType<
  typeof useBehaviours
>[number];

const behaviour = graphql(/* GraphQL */ `
  query notes_notes_behaviour($filter: Notes_NotesFilter!) {
    notes_notes(filter: $filter) {
      id
      note
      createdOn
      createdBy
      incidentDate
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
        behaviourType
        descriptionTextId
        nameTextId
      }
      associatedGroups {
        __typename
        partyId
        ... on SubjectGroup {
          subjects {
            name
            colour
          }
        }
      }
    }
  }
`);

const behavioursQuery = (studentId: number | undefined) => ({
  queryKey: peopleKeys.students.behaviours(studentId),
  queryFn: async () =>
    gqlClient.request(behaviour, {
      filter: {
        partyIds: [studentId ?? 0],
        noteType: Notes_TagCategory.Behaviour,
      },
    }),
});

export function getBehaviours(studentId: number | undefined) {
  return queryClient.fetchQuery(behavioursQuery(studentId));
}

export function useBehaviours(studentId: number | undefined) {
  return useQuery({
    ...behavioursQuery(studentId),
    select: ({ notes_notes }) => notes_notes,
  });
}
