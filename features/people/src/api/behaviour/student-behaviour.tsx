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
        referencedParties {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        associatedParties {
          __typename
          partyId
          ... on SubjectGroup {
            name
            subjects {
              name
              colour
            }
          }
          ... on Student {
            person {
              partyId
              firstName
              lastName
              avatarUrl
              type
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
          behaviourType
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

const studentBehaviourQuery = (filter: Notes_BehaviourFilter) => ({
  queryKey: peopleKeys.students.individualStudentBehaviours(filter),
  queryFn: async () =>
    gqlClient.request(individualStudentBehaviour, { filter }),
});

export function getStudentBehaviour(filter: Notes_BehaviourFilter) {
  return queryClient.fetchQuery(studentBehaviourQuery(filter));
}

export function useStudentBehaviour(filter: Notes_BehaviourFilter) {
  return useQuery({
    ...studentBehaviourQuery(filter),
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

export type ReturnTypeFromUseStudentBehaviour = UseQueryReturnType<
  typeof useStudentBehaviour
>[number];

export type ReturnTypeFromBehaviourCategories = UseQueryReturnType<
  typeof useBehaviourCategories
>[number];
