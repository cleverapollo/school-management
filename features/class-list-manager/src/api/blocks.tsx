import { useQuery } from '@tanstack/react-query';
import {
  EnrollmentIre_BlockEnrollmentFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { classListManagerKeys } from './keys';

const blocks = graphql(/* GraphQL */ `
  query core_blocks($filter: BlockFilter) {
    core_blocks(filter: $filter) {
      blockId
      name
      description
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
        rotationName
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

export function useBlockMembership(blockId: string | null) {
  return useQuery({
    ...blockMembershipsQuery({ blockId: blockId || '' }),
    enabled: !!blockId,
    select: ({ enrollment_ire_blockMemberships }) => ({
      ...enrollment_ire_blockMemberships,
      groups: enrollment_ire_blockMemberships.groups.map((group) => ({
        ...group,
        unenrolledStudents: group.unenrolledStudents.map((student) => ({
          id: String(student.person.partyId),
          ...student,
        })),
        subjectGroups: group.subjectGroups.map((subjectGroup) => ({
          ...subjectGroup,
          students: subjectGroup.students.map((student) => ({
            id: student.isDuplicate
              ? `${student.person.partyId}-${subjectGroup.partyId}`
              : String(student.person.partyId),
            ...student,
          })),
        })),
      })),
    }),
  });
}

export type ReturnTypeOfUseBlockMembership = UseQueryReturnType<
  typeof useBlockMembership
>;
