import { useMutation, useQuery } from '@tanstack/react-query';
import {
  EnrollmentIre_BlockEnrollmentFilter,
  EnrollmentIre_UpsertBlockMembership,
  Enrollment_Ire_BlockMembershipsQuery,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { usePreferredNameLayout, useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useCallback } from 'react';
import { classListManagerKeys } from './keys';
import { sortByDisplayName } from '../utils/sort-by-name';

const blocks = graphql(/* GraphQL */ `
  query core_blocks($filter: BlockFilter) {
    core_blocks(filter: $filter) {
      blockId
      name
      description
      subjectGroupNamesJoined
      isRotation
      rotations {
        iteration
        startDate
        endDate
      }
    }
  }
`);

const blockMemberships = graphql(/* GraphQL */ `
  query enrollment_ire_blockMemberships(
    $filter: EnrollmentIre_BlockEnrollmentFilter!
  ) {
    enrollment_ire_blockMemberships(filter: $filter) {
      blockId
      block {
        blockId
        name
        description
        classGroupIds
        subjectGroupIds
      }
      isRotation
      groups {
        rotationIteration
        unenrolledStudents {
          isDuplicate
          person {
            partyId
            title
            firstName
            lastName
            avatarUrl
            type
          }
        }
        subjectGroups {
          partyId
          name
          students {
            isDuplicate
            person {
              partyId
              title
              firstName
              lastName
              avatarUrl
              type
            }
          }
          staff {
            partyId
            title
            firstName
            lastName
            avatarUrl
            type
          }
        }
      }
    }
  }
`);

const upsertBlockMemberships = graphql(/* GraphQL */ `
  mutation enrollment_ire_upsertBlockMemberships(
    $input: EnrollmentIre_UpsertBlockMembership!
  ) {
    enrollment_ire_upsertBlockMemberships(input: $input) {
      blockId
    }
  }
`);

const blocksQuery = () => ({
  queryKey: classListManagerKeys.blocksList(),
  queryFn: () => gqlClient.request(blocks, { filter: {} }),
});

export function useBlocksList() {
  return useQuery({
    ...blocksQuery(),
    select: ({ core_blocks }) => core_blocks,
  });
}

export function getBlocksList() {
  return queryClient.fetchQuery(blocksQuery());
}

const blockMembershipsQuery = (
  filter: EnrollmentIre_BlockEnrollmentFilter
) => ({
  queryKey: classListManagerKeys.blockMemberships(filter),
  queryFn: () => gqlClient.request(blockMemberships, { filter }),
});

export function useBlockMemberships(blockId: string | null) {
  const { displayName } = usePreferredNameLayout();
  return useQuery({
    ...blockMembershipsQuery({ blockId: blockId || '' }),
    enabled: !!blockId,
    select: useCallback(
      ({
        enrollment_ire_blockMemberships,
      }: Enrollment_Ire_BlockMembershipsQuery) => ({
        ...enrollment_ire_blockMemberships,
        groups: enrollment_ire_blockMemberships.groups.map((group) => ({
          ...group,
          unenrolledStudents: group.unenrolledStudents
            .sort((a, b) => sortByDisplayName(displayName, a.person, b.person))
            .map((student) => ({
              id: String(student.person.partyId),
              ...student,
            })),
          subjectGroups: group.subjectGroups.map((subjectGroup) => ({
            ...subjectGroup,
            students: subjectGroup.students
              .sort((a, b) =>
                sortByDisplayName(displayName, a.person, b.person)
              )
              .map((student) => ({
                id: student.isDuplicate
                  ? `${student.person.partyId}-${subjectGroup.partyId}`
                  : String(student.person.partyId),
                ...student,
              })),
          })),
        })),
      }),
      [displayName]
    ),
  });
}

export function useUpdateBlockMemberships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_UpsertBlockMembership) =>
      gqlClient.request(upsertBlockMemberships, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(classListManagerKeys.allBlockMemberships());
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}

export type ReturnTypeOfUseBlockList = UseQueryReturnType<typeof useBlocksList>;

export type ReturnTypeOfUseBlockMemberships = UseQueryReturnType<
  typeof useBlockMemberships
>;
