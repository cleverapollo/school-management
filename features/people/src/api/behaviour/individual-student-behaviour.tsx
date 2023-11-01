import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  queryClient,
  Notes_BehaviourFilter,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const individualStudentBehaviour = graphql(/* GraphQL */ `
  query notes_behaviour($filter: Notes_BehaviourFilter) {
    notes_behaviour(filter: $filter) {
      behaviours {
        noteId
        incidentDate
        associatedParties {
          __typename
          partyId
          ... on SubjectGroup {
            subjects {
              name
              colour
            }
          }
        }
        associatedPartyIds
        category
        details
        takenByPartyId
        takenBy {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        tags {
          id
          name
          description
        }
        tagIds
      }
    }
  }
`);

const behaviourCategories = graphql(/* GraphQL */ `
  query notes_categories($filter: Notes_BehaviourFilter) {
    notes_behaviour(filter: $filter) {
      categories {
        behaviourCategoryId
        name
        colour
        count
      }
    }
  }
`);

const individualStudentBehaviourQuery = (filter: Notes_BehaviourFilter) => ({
  queryKey: peopleKeys.students.individualStudentBehaviours(filter),
  queryFn: async () =>
    gqlClient.request(individualStudentBehaviour, { filter }),
});

export function getIndividualStudentBehaviour(filter: Notes_BehaviourFilter) {
  return queryClient.fetchQuery(individualStudentBehaviourQuery(filter));
}

export function useIndividualStudentBehaviour(filter: Notes_BehaviourFilter) {
  return useQuery({
    ...individualStudentBehaviourQuery(filter),
    select: ({ notes_behaviour }) => notes_behaviour?.behaviours,
  });
}

const behaviourCategoriesQuery = (filter: Notes_BehaviourFilter) => ({
  queryKey: peopleKeys.students.individualStudentBehavioursCategories(filter),
  queryFn: async () => gqlClient.request(behaviourCategories, { filter }),
});

export function getBehaviourCategories(filter: Notes_BehaviourFilter) {
  return queryClient.fetchQuery(behaviourCategoriesQuery(filter));
}

export function useBehaviourCategories(filter: Notes_BehaviourFilter) {
  return useQuery({
    ...behaviourCategoriesQuery(filter),
    select: ({ notes_behaviour }) => notes_behaviour?.categories,
  });
}

export type ReturnTypeFromUseIndividualStudentBehaviour = UseQueryReturnType<
  typeof useIndividualStudentBehaviour
>[number];

export type ReturnTypeFromBehaviourCategories = UseQueryReturnType<
  typeof useBehaviourCategories
>[number];
