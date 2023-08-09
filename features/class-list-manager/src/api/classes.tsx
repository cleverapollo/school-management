import { useMutation, useQuery } from '@tanstack/react-query';
import {
  EnrollmentIre_CoreEnrollmentFilter,
  EnrollmentIre_UpsertCoreMembership,
  Enrollment_Ire_CoreMembershipsQuery,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  EnrollmentIre_AutoAssignCoreMembershipInput,
} from '@tyro/api';
import { usePreferredNameLayout, useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { groupsKeys } from '@tyro/groups';
import { useCallback } from 'react';
import { peopleKeys } from '@tyro/people';
import { nanoid } from 'nanoid';
import { classListManagerKeys } from './keys';

const classMemberships = graphql(/* GraphQL */ `
  query enrollment_ire_coreMemberships(
    $filter: EnrollmentIre_CoreEnrollmentFilter!
  ) {
    enrollment_ire_coreMemberships(filter: $filter) {
      yearGroupEnrollment {
        yearGroupId
        name
      }
      unenrolledStudents {
        personalInformation {
          gender
        }
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
      classGroups {
        partyId
        name
        students {
          personalInformation {
            gender
          }
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
`);

const upsertClassMemberships = graphql(/* GraphQL */ `
  mutation enrollment_ire_upsertCoreMemberships(
    $input: EnrollmentIre_UpsertCoreMembership!
  ) {
    enrollment_ire_upsertCoreMemberships(input: $input) {
      yearGroupEnrollment {
        yearGroupId
      }
    }
  }
`);

const autoAssignCore = graphql(/* GraphQL */ `
  mutation enrollment_ire_autoAssignCore(
    $input: EnrollmentIre_AutoAssignCoreMembershipInput!
  ) {
    enrollment_ire_autoAssignCore(input: $input) {
      success
    }
  }
`);

const classMembershipsQuery = (filter: EnrollmentIre_CoreEnrollmentFilter) => ({
  queryKey: classListManagerKeys.classMemberships(filter),
  queryFn: () => gqlClient.request(classMemberships, { filter }),
});

export function useClassMemberships(yearGroupEnrollmentId: number | undefined) {
  const { sortByDisplayName } = usePreferredNameLayout();
  return useQuery({
    ...classMembershipsQuery({
      yearGroupEnrollmentId: yearGroupEnrollmentId || 0,
    }),
    enabled: !!yearGroupEnrollmentId,
    select: useCallback(
      ({
        enrollment_ire_coreMemberships,
      }: Enrollment_Ire_CoreMembershipsQuery) => ({
        ...enrollment_ire_coreMemberships,
        id: nanoid(4),
        unenrolledStudents: enrollment_ire_coreMemberships.unenrolledStudents
          .sort((a, b) => sortByDisplayName(a.person, b.person))
          .map((student) => ({
            ...student,
            gender: student?.personalInformation?.gender,
            id: String(student?.person.partyId),
          })),
        classGroups: enrollment_ire_coreMemberships.classGroups.map(
          (classGroup) => ({
            ...classGroup,
            students: classGroup.students
              .sort((a, b) => sortByDisplayName(a?.person, b?.person))
              .map((student) => ({
                ...student,
                gender: student?.personalInformation?.gender,
                id: String(student?.person.partyId),
              })),
          })
        ),
      }),
      [sortByDisplayName]
    ),
  });
}

export function useUpdateClassMemberships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_UpsertCoreMembership) =>
      gqlClient.request(upsertClassMemberships, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(classListManagerKeys.allClassMemberships());
      queryClient.invalidateQueries(classListManagerKeys.allBlockMemberships());
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

export function useAutoAssignCore() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_AutoAssignCoreMembershipInput) =>
      gqlClient.request(autoAssignCore, { input }),
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

export type ReturnTypeOfUseClassMemberships = UseQueryReturnType<
  typeof useClassMemberships
>;
