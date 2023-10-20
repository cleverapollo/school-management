import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  Assessment_AssessmentResultQuery,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  StudentResultFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { assessmentsKeys } from '../keys';

const studentResults = graphql(/* GraphQL */ `
  query assessment_studentResult($filter: StudentResultFilter) {
    assessment_studentResult(filter: $filter) {
      id
      assessmentId
      studentPartyId
      student {
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
        extensions {
          priority
        }
      }
      studentClassGroup
      studentProgramme {
        shortName
      }
      subjectGroup {
        partyId
        name
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
        subjects {
          name
          colour
        }
      }
      studentStudyLevel
      result
      targetResult
      gradeResult
      gradeNameTextId
      targetGradeResult
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

const studentAssessmentResultsQuery = (
  academicNamespaceId: number,
  filter: StudentResultFilter
) => ({
  queryKey: assessmentsKeys.assessmentResultsForStudent(
    academicNamespaceId,
    filter ?? {}
  ),
  queryFn: () =>
    gqlClient.request(
      studentResults,
      { filter },
      { [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString() }
    ),
});

export function getStudentAssessmentResults(
  academicNamespaceId: number,
  filter: StudentResultFilter
) {
  return queryClient.fetchQuery(
    studentAssessmentResultsQuery(academicNamespaceId, filter)
  );
}

export function useStudentAssessmentResults(
  academicNamespaceId: number,
  filter: StudentResultFilter | null
) {
  return useQuery({
    ...studentAssessmentResultsQuery(academicNamespaceId, filter ?? {}),
    enabled: !!filter,
    select: useCallback(
      ({ assessment_assessmentResult }: Assessment_AssessmentResultQuery) =>
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
      []
    ),
  });
}

export type ReturnTypeFromUseAssessmentResults = UseQueryReturnType<
  typeof useStudentAssessmentResults
>[number];
