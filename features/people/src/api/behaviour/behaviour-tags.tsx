import {
  gqlClient,
  graphql,
  Notes_TagCategory,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

export type ReturnTypeFromUseNoteTagsBehaviour = UseQueryReturnType<
  typeof useNoteTagsBehaviour
>[number];

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
  queryFn: async () => {
    const { notes_tags: tags } = await gqlClient.request(noteTagsBehaviour, {
      filter: {
        categories: [Notes_TagCategory.Behaviour],
      },
    });

    return tags.sort((prev, next) => prev.name.localeCompare(next.name));
  },
});

export function useNoteTagsBehaviour() {
  return useQuery({
    ...noteTagsBehaviourQuery(),
    select: (tags) => tags,
  });
}
