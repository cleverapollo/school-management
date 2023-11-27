import { useQuery } from '@tanstack/react-query';
import {
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
          nationalCode
        }
      }
      studentStudyLevel
      result
      targetResult
      gradeResult
      gradeNameTextId
      targetGradeResult
      targetGradeNameTextId
      examinable
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
  queryFn: async () => {
    const { assessment_studentResult: assessmentStudentResult } =
      await gqlClient.request(
        studentResults,
        { filter },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
            academicNamespaceId.toString(),
        }
      );

    return {
      assessment_studentResult: assessmentStudentResult.sort(
        (resultA, resultB) => {
          const nationalCodeA =
            resultA.subjectGroup?.subjects?.[0]?.nationalCode ?? '';
          const nationalCodeB =
            resultB.subjectGroup?.subjects?.[0]?.nationalCode ?? '';

          if (
            !Number.isNaN(Number(nationalCodeA)) &&
            !Number.isNaN(Number(nationalCodeB))
          ) {
            return Number(nationalCodeA) - Number(nationalCodeB);
          }

          return nationalCodeA.localeCompare(nationalCodeB);
        }
      ),
    };
  },
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
    ...studentAssessmentResultsQuery(
      academicNamespaceId,
      filter ?? { assessmentId: 0 }
    ),
    enabled: !!filter,
    select: ({ assessment_studentResult }) =>
      assessment_studentResult.filter(({ examinable }) => examinable),
  });
}

export type ReturnTypeFromUseStudentAssessmentResults = UseQueryReturnType<
  typeof useStudentAssessmentResults
>;
