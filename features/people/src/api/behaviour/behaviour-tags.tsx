import {
  gqlClient,
  graphql,
  Notes_TagCategory,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const noteTagsBehaviour = graphql(/* GraphQL */ `
  query notes_tags_behaviours($filter: Notes_TagFilter!) {
    notes_tags(filter: $filter) {
      id
      name
      description
      tag_l1
      tag_l2
      tag_l3
    }
  }
`);

const noteTagsBehaviourQuery = () => ({
  queryKey: peopleKeys.notes.noteTags(),
  queryFn: () =>
    gqlClient.request(noteTagsBehaviour, {
      filter: {
        categories: [Notes_TagCategory.Behaviour],
      },
    }),
});

export function useNoteTagsBehaviour() {
  return useQuery({
    ...noteTagsBehaviourQuery(),
    select: ({ notes_tags }) =>
      notes_tags?.flatMap((note) => (note ? [note] : [])),
  });
}

export type ReturnTypeFromUseNoteTags = UseQueryReturnType<
  typeof noteTagsBehaviour
>[number];
