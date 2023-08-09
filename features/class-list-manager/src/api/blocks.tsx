import { useMutation, useQuery } from '@tanstack/react-query';
import {
  EnrollmentIre_BlockEnrollmentFilter,
  EnrollmentIre_UpsertBlockMembership,
  Enrollment_Ire_BlockMembershipsQuery,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  BlockFilter,
  Core_EnableBlockRotationInput,
  EnrollmentIre_AutoAssignBlockMembershipInput,
} from '@tyro/api';
import { usePreferredNameLayout, useToast } from '@tyro/core';
import { groupsKeys } from '@tyro/groups';
import { nanoid } from 'nanoid';
import { useTranslation } from '@tyro/i18n';
import { useCallback } from 'react';
import { peopleKeys } from '@tyro/people';
import { classListManagerKeys } from './keys';

const blocks = graphql(/* GraphQL */ `
  query core_blocks($filter: BlockFilter) {
    core_blocks(filter: $filter) {
      blockId
      name
      description
      subjectGroupNamesJoined
      subjectGroupIds
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
          classGroupName
          gender
          person {
            partyId
            title {
              id
              name
              nameTextId
            }
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
            classGroupName
            gender
            person {
              partyId
              title {
                id
                name
                nameTextId
              }
              firstName
              lastName
              avatarUrl
              type
            }
          }
          staff {
            partyId
            title {
              id
              name
              nameTextId
            }
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

const enableBlockRotations = graphql(/* GraphQL */ `
  mutation core_enableBlockRotations($input: Core_EnableBlockRotationInput!) {
    core_enableBlockRotations(input: $input) {
      success
    }
  }
`);

const autoAssignBlock = graphql(/* GraphQL */ `
  mutation enrollment_ire_autoAssignBlocks(
    $input: EnrollmentIre_AutoAssignBlockMembershipInput!
  ) {
    enrollment_ire_autoAssignBlocks(input: $input) {
      success
    }
  }
`);
const blocksQuery = (filter: BlockFilter) => ({
  queryKey: classListManagerKeys.blocksList(filter),
  queryFn: async () => {
    const { core_blocks: coreBlocks } = await gqlClient.request(blocks, {
      filter,
    });
    return {
      core_blocks: coreBlocks.sort((prev, next) =>
        prev.blockId.localeCompare(next.blockId)
      ),
    };
  },
});

export function useBlocksList(yearGroupId: number) {
  return useQuery({
    ...blocksQuery({ yearGroupIds: [yearGroupId] }),
    enabled: !!yearGroupId,
    select: ({ core_blocks }) => core_blocks,
  });
}

export function getBlocksList(yearGroupId: number) {
  return queryClient.fetchQuery(blocksQuery({ yearGroupIds: [yearGroupId] }));
}

const blockMembershipsQuery = (
  filter: EnrollmentIre_BlockEnrollmentFilter
) => ({
  queryKey: classListManagerKeys.blockMemberships(filter),
  queryFn: () => gqlClient.request(blockMemberships, { filter }),
});

export function useBlockMemberships(blockId: string | null) {
  const { sortByDisplayName } = usePreferredNameLayout();
  return useQuery({
    ...blockMembershipsQuery({ blockId: blockId || '' }),
    enabled: !!blockId,
    select: useCallback(
      ({
        enrollment_ire_blockMemberships,
      }: Enrollment_Ire_BlockMembershipsQuery) => ({
        ...enrollment_ire_blockMemberships,
        id: nanoid(4),
        groups: enrollment_ire_blockMemberships.groups.map((group) => ({
          ...group,
          unenrolledStudents: group.unenrolledStudents
            .sort((a, b) => sortByDisplayName(a.person, b.person))
            .map((student) => ({
              ...student,
              id: String(student.person.partyId),
            })),
          subjectGroups: group.subjectGroups.map((subjectGroup) => ({
            ...subjectGroup,
            students: subjectGroup.students
              .sort((a, b) => sortByDisplayName(a.person, b.person))
              .map((student) => ({
                ...student,
                id: student.isDuplicate
                  ? `${student.person.partyId}-${nanoid(10)}`
                  : String(student.person.partyId),
              })),
          })),
        })),
      }),
      [sortByDisplayName]
    ),
  });
}

export function useUpdateBlockMemberships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_UpsertBlockMembership) =>
      gqlClient.request(upsertBlockMemberships, { input }),
    onSuccess: async () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      await queryClient.invalidateQueries(
        classListManagerKeys.allBlockMemberships()
      );
      queryClient.invalidateQueries(groupsKeys.all);
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}

export function useAutoAssignBlock() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_AutoAssignBlockMembershipInput) =>
      gqlClient.request(autoAssignBlock, { input }),
    onSuccess: async () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      await queryClient.invalidateQueries(classListManagerKeys.all);
      queryClient.invalidateQueries(groupsKeys.all);
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}

export function useCreateOrUpdateBlockRotation(isEdit: boolean) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: classListManagerKeys.createOrUpdateBlockRotation(),
    mutationFn: async (input: Core_EnableBlockRotationInput) =>
      gqlClient.request(enableBlockRotations, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: () => {
      toast(
        isEdit
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
      queryClient.invalidateQueries(classListManagerKeys.all);
    },
  });
}

export type ReturnTypeOfUseBlockList = UseQueryReturnType<typeof useBlocksList>;

export type ReturnTypeOfUseBlockMemberships = UseQueryReturnType<
  typeof useBlockMemberships
>;
