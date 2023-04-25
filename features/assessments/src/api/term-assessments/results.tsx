import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AssessmentResultFilter,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentResultInput,
  UseQueryReturnType,
} from '@tyro/api';

const assessmentResults = graphql(/* GraphQL */ `
  query assessment_assessmentResult($filter: AssessmentResultFilter) {
    assessment_assessmentResult(filter: $filter) {
      id
      assessmentId
      studentPartyId
      student {
        title
        firstName
        lastName
        avatarUrl
        type
      }
      studentClassGroup
      studentProgramme {
        shortName
      }
      subjectGroup {
        partyId
        name
      }
      studentStudyLevel
      result
      targetResult
      gradeResult
      gradeNameTextId
      targetGrade
      targetGradeNameTextId
      teacherComment {
        id
        assessmentId
        studentPartyId
        comment
        commentBankCommentId
        commenterUserType
        commenterPartyId
        subjectGroupPartyId
      }
      extraFields {
        id
        extraFieldType
        assessmentResultId
        assessmentExtraFieldId
        result
        gradeSetGradeId
        gradeNameTextId
        commentBankCommentId
      }
    }
  }
`);

const updateAssessmentResult = graphql(/* GraphQL */ `
  mutation assessment_saveAssessmentResults(
    $input: [SaveAssessmentResultInput!]
  ) {
    assessment_saveAssessmentResults(input: $input) {
      id
    }
  }
`);

export const assessmentResultKeys = {
  list: (filter: AssessmentResultFilter) =>
    ['assessments', 'results', filter] as const,
};

const assessmentResultsQuery = (filter: AssessmentResultFilter) => ({
  queryKey: assessmentResultKeys.list(filter ?? {}),
  queryFn: () => gqlClient.request(assessmentResults, { filter }),
});

export function getAssessmentResults(filter: AssessmentResultFilter) {
  return queryClient.fetchQuery(assessmentResultsQuery(filter));
}

export function useAssessmentResults(filter: AssessmentResultFilter | null) {
  return useQuery({
    ...assessmentResultsQuery(filter ?? {}),
    enabled: !!filter,
    select: ({ assessment_assessmentResult }) =>
      assessment_assessmentResult?.map((result) => {
        const extraFields =
          result?.extraFields?.reduce((acc, extraField) => {
            acc[extraField.assessmentExtraFieldId] = extraField;
            return acc;
          }, {} as Record<number, NonNullable<(typeof result)['extraFields']>[number]>) ??
          {};

        return {
          ...result,
          extraFields,
        };
      }),
  });
}

export type ReturnTypeFromUseAssessmentResults = UseQueryReturnType<
  typeof useAssessmentResults
>[number];

export function useUpdateAssessmentResult() {
  return useMutation({
    mutationFn: (input: SaveAssessmentResultInput[]) =>
      gqlClient.request(updateAssessmentResult, { input }),
  });
}
