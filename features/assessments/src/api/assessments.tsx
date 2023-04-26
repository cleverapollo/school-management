import { useQuery } from '@tanstack/react-query';

import { AssessmentFilter, gqlClient, graphql, queryClient } from '@tyro/api';
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
      createdOn
      createdBy {
        type
        title
        firstName
        lastName
        avatarUrl
      }
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
      capturePrincipalComment
      captureYearHeadComment
      captureHouseMasterComment
      publish
      publishLearner
      extraFields {
        id
        name
        assessmentId
        extraFieldType
        gradeSetId
        commentBankId
        selectOptions
        commentLength
      }
      createdBy {
        type
        title
        firstName
        lastName
        avatarUrl
      }
    }
  }
`);

const assessmentsQuery = (filter: AssessmentFilter) => ({
  queryKey: assessmentsKeys.assessments(filter),
  queryFn: () => gqlClient.request(assessmentsList, { filter }),
});

const assessmentByIdQuery = (filter: AssessmentFilter) => ({
  queryKey: assessmentsKeys.assessments(filter),
  queryFn: () => gqlClient.request(assessment, { filter }),
});

export function getAssessments(filter: AssessmentFilter) {
  return queryClient.fetchQuery(assessmentsQuery(filter));
}

export function useAssessments(filter: AssessmentFilter) {
  return useQuery({
    ...assessmentsQuery(filter),
    select: ({ assessment_assessment }) => {
      if (!Array.isArray(assessment_assessment)) return [];

      return assessment_assessment;
    },
  });
}

export function getAssessmentById(termAssessmentId: number) {
  return queryClient.fetchQuery(
    assessmentByIdQuery({ ids: [termAssessmentId] })
  );
}

export function useAssessmentById(termAssessmentId: number) {
  return useQuery({
    ...assessmentByIdQuery({ ids: [termAssessmentId] }),
    enabled: !!termAssessmentId,
    select: ({ assessment_assessment }) =>
      Array.isArray(assessment_assessment) && assessment_assessment.length > 0
        ? assessment_assessment[0]
        : null,
  });
}
