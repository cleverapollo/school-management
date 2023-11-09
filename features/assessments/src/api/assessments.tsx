import { useMutation, useQuery } from '@tanstack/react-query';

import {
  AssessmentFilter,
  EmulateHeaders,
  gqlClient,
  graphql,
  PublishAssessmentInput,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from './keys';

const assessmentsList = graphql(/* GraphQL */ `
  query assessmentsList($filter: AssessmentFilter) {
    assessment_assessment(filter: $filter) {
      id
      name
      assessmentType
      academicNamespaceId
      years {
        yearGroupId
        name
      }
      publish
      publishedFrom
      startDate
      endDate
      createdBy {
        type
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
      }
      canEnterOverallComments
    }
  }
`);

const assessment = graphql(/* GraphQL */ `
  query assessment($filter: AssessmentFilter) {
    assessment_assessment(filter: $filter) {
      id
      name
      assessmentType
      academicNamespaceId
      years {
        yearGroupId
        name
      }
      yearGroupEnrolments {
        yearGroupEnrollmentPartyId
        name
      }
      publish
      createdOn
      gradeType
      gradeSets {
        gradeSetId
        gradeSetName
      }
      passFailThreshold
      captureTarget
      commentType
      commentLength
      commentBank {
        commentBankId
        commentBankName
      }
      publish
      publishLearner
      extraFields {
        id
        name
        assessmentId
        extraFieldType
        gradeSetId
        commentBankId
        commentBankName
        selectOptions
        commentLength
      }
      createdBy {
        type
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
      }
      startDate
      endDate
      captureTutorComment
      capturePrincipalComment
      captureYearHeadComment
      captureHouseMasterComment
      tutorCommentType
      tutorCommentBank {
        commentBankId
        commentBankName
      }
      tutorCommentLength
      yearHeadCommentType
      yearHeadCommentBank {
        commentBankId
        commentBankName
      }
      yearHeadCommentLength
      principalCommentType
      principalCommentBank {
        commentBankId
        commentBankName
      }
      principalCommentLength
      housemasterCommentType
      housemasterCommentBank {
        commentBankId
        commentBankName
      }
      housemasterCommentLength
    }
  }
`);

const publishAssessment = graphql(/* GraphQL */ `
  mutation assessment_publish($input: PublishAssessmentInput) {
    assessment_publish(input: $input) {
      success
    }
  }
`);

interface AssessmentListFilter extends AssessmentFilter {
  academicNameSpaceId: number;
}

interface AssessmentByIdFilter extends AssessmentFilter {
  academicNameSpaceId: number;
  ids: number[];
}

const assessmentsQuery = (filter: AssessmentListFilter) => ({
  queryKey: assessmentsKeys.assessments(filter),
  queryFn: () =>
    gqlClient.request(
      assessmentsList,
      { filter },
      {
        [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
          filter.academicNameSpaceId.toString(),
      }
    ),
});

const assessmentByIdQuery = (filter: AssessmentByIdFilter) => ({
  queryKey: assessmentsKeys.assessments(filter),
  queryFn: () =>
    gqlClient.request(
      assessment,
      { filter },
      {
        [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
          filter.academicNameSpaceId.toString(),
      }
    ),
});

export function getAssessments(filter: AssessmentListFilter) {
  return queryClient.fetchQuery(assessmentsQuery(filter));
}

export function useAssessments(filter: AssessmentListFilter) {
  return useQuery({
    ...assessmentsQuery(filter),
    select: ({ assessment_assessment }) => {
      if (!Array.isArray(assessment_assessment)) return [];

      return assessment_assessment;
    },
  });
}

export function getAssessmentById(filter: AssessmentByIdFilter) {
  return queryClient.fetchQuery(assessmentByIdQuery(filter));
}

export function useAssessmentById(filter: AssessmentByIdFilter) {
  return useQuery({
    ...assessmentByIdQuery(filter),
    enabled: !!filter,
    select: ({ assessment_assessment }) =>
      Array.isArray(assessment_assessment) && assessment_assessment.length > 0
        ? assessment_assessment[0]
        : null,
  });
}

export function usePublishAssessment() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: PublishAssessmentInput) =>
      gqlClient.request(publishAssessment, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}

export type ReturnTypeFromUseAssessmentById = UseQueryReturnType<
  typeof useAssessmentById
>;

export type ReturnTypeFromUseAssessments = UseQueryReturnType<
  typeof useAssessments
>[number];
