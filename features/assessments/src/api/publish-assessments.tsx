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
import { Dayjs } from 'dayjs';
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

async function getSubjectGroupIds(
  academicNamespaceId: number,
  assessmentId: number
) {
  const response = await getAssessmentSubjectGroups(academicNamespaceId, {
    assessmentId,
  });

  const data = response?.assessment_assessmentSubjectGroups;
  const subjectGroupIds = data?.map(
    (subject) => subject?.subjectGroup?.partyId
  );

  return subjectGroupIds;
}

export function usePublishAssessmentBasedOnType(
  id: number,
  isTermAssessment: boolean
) {
  const { toast } = useToast();
  const { t } = useTranslation(['assessments', 'common']);

  const { mutateAsync: publishAssessment, isLoading: isSubmitting } =
    usePublishAssessment();
  const { mutateAsync: publishStateCba, isLoading: isSubmittingStateCba } =
    usePublishStateCba();

  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;

  return {
    publish: async (publishDate: Dayjs, onClose: () => void) => {
      if (isTermAssessment) {
        publishAssessment(
          {
            assessmentId: id,
            publish: true,
            publishFrom: publishDate.format('YYYY-MM-DD'),
          },
          {
            onSuccess: () => {
              onClose();
              toast(t('common:snackbarMessages.updateSuccess'));
            },
          }
        );
      } else {
        try {
          const subjectGroupIds = await getSubjectGroupIds(
            academicNamespaceIdAsNumber,
            id
          );

          publishStateCba(
            {
              assessmentId: id,
              subjectGroupIds,
              publish: true,
              publishFrom: publishDate.format('YYYY-MM-DD'),
            },
            {
              onSuccess: () => {
                onClose();
                toast(t('common:snackbarMessages.updateSuccess'));
              },
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
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
          const subjectGroupIds = await getSubjectGroupIds(
            academicNamespaceIdAsNumber,
            id
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
    isSubmitting,
    isSubmittingStateCba,
  };
}
