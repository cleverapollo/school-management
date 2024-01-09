import { useMutation } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  PublishAssessmentInput,
  useAcademicNamespace,
} from '@tyro/api';
import { useNumber, useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from './keys';
import { getAssessmentSubjectGroups } from './assessment-subject-groups';

const publishStateCbaOnline = graphql(/* GraphQL */ `
  mutation assessment_publishStateCba($input: PublishAssessmentInput) {
    assessment_publishStateCba(input: $input) {
      success
    }
  }
`);

const publishAssessmentOnline = graphql(/* GraphQL */ `
  mutation assessment_publish($input: PublishAssessmentInput) {
    assessment_publish(input: $input) {
      success
    }
  }
`);

export function usePublishStateCba(academicNameSpaceId?: number) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeAcademicNamespace } = useAcademicNamespace();

  return useMutation({
    mutationFn: (input: PublishAssessmentInput) =>
      gqlClient.request(
        publishStateCbaOnline,
        { input },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: (
            academicNameSpaceId ??
            activeAcademicNamespace?.academicNamespaceId ??
            0
          )?.toString(),
        }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}

export function usePublishAssessment() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: PublishAssessmentInput) =>
      gqlClient.request(publishAssessmentOnline, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}

export function useUnpublishAssessment(id: number, isTermAssessment: boolean) {
  const { toast } = useToast();
  const { t } = useTranslation(['assessments']);

  const { mutateAsync: publishAssessment } = usePublishAssessment();
  const { mutateAsync: publishStateCba } = usePublishStateCba();

  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;

  return {
    unpublish: async () => {
      if (isTermAssessment) {
        publishAssessment(
          {
            assessmentId: id,
            publish: false,
          },
          {
            onSuccess: () => {
              toast(t('assessments:unpublishedSuccessfully'));
            },
          }
        );
      } else {
        try {
          const response = await getAssessmentSubjectGroups(
            academicNamespaceIdAsNumber,
            {
              assessmentId: id,
            }
          );

          const data = response?.assessment_assessmentSubjectGroups;
          const subjectGroupIds = data?.map(
            (subject) => subject?.subjectGroup?.partyId
          );

          publishStateCba(
            {
              assessmentId: id,
              subjectGroupIds,
              publish: false,
            },
            {
              onSuccess: () => {
                toast(t('assessments:unpublishedSuccessfully'));
              },
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
  };
}
