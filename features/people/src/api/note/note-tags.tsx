import { gqlClient, graphql, UseQueryReturnType } from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const noteTags = graphql(/* GraphQL */ `
  query notes_tags($filter: Notes_TagFilter!) {
    notes_tags(filter: $filter) {
      id
      name
    }
  }
`);

const noteTagsQuery = () => ({
  queryKey: peopleKeys.notes.noteTags(),
  queryFn: () =>
    gqlClient.request(noteTags, {
      filter: {},
    }),
});

export function useNoteTags() {
  return useQuery({
    ...noteTagsQuery(),
    select: ({ notes_tags }) =>
      notes_tags?.flatMap((note) => (note ? [note] : [])),
  });
}

export type ReturnTypeFromUseNoteTags = UseQueryReturnType<
  typeof useNoteTags
>[number];
