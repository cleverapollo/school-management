import { useMutation, useQuery } from '@tanstack/react-query';
import {
  EnrollmentIre_CoreEnrollmentFilter,
  EnrollmentIre_UpsertCoreMembership,
  Enrollment_Ire_CoreMembershipsQuery,
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
        person {
          partyId
          title
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

const classMembershipsQuery = (filter: EnrollmentIre_CoreEnrollmentFilter) => ({
  queryKey: classListManagerKeys.classMemberships(filter),
  queryFn: () => gqlClient.request(classMemberships, { filter }),
});

export function useClassMemberships(yearGroupEnrollmentId: number | undefined) {
  const { displayName } = usePreferredNameLayout();
  return useQuery({
    ...classMembershipsQuery({
      yearGroupEnrollmentId: yearGroupEnrollmentId || 0,
    }),
    keepPreviousData: true,
    enabled: !!yearGroupEnrollmentId,
    select: useCallback(
      ({
        enrollment_ire_coreMemberships,
      }: Enrollment_Ire_CoreMembershipsQuery) => ({
        ...enrollment_ire_coreMemberships,
        unenrolledStudents: enrollment_ire_coreMemberships.unenrolledStudents
          .sort((a, b) => sortByDisplayName(displayName, a.person, b.person))
          .map((student) => ({
            ...student,
            id: String(student?.person.partyId),
            isDuplicate: false,
          })),
        classGroups: enrollment_ire_coreMemberships.classGroups.map(
          (classGroup) => ({
            ...classGroup,
            students: classGroup.students
              .sort((a, b) =>
                sortByDisplayName(displayName, a?.person, b?.person)
              )
              .map((student) => ({
                ...student,
                id: String(student?.person.partyId),
                isDuplicate: false,
              })),
          })
        ),
      }),
      [displayName]
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
