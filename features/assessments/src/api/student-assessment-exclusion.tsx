import {
  EmulateHeaders,
  gqlClient,
  graphql,
  StudentAssessmentExclusionInput,
} from '@tyro/api';

const studentAssessmentExclusion = graphql(/* GraphQL */ `
  mutation assessment_studentAssessmentExclusion(
    $input: [StudentAssessmentExclusionInput]
  ) {
    assessment_studentAssessmentExclusion(input: $input) {
      success
    }
  }
`);

export function updateStudentAssessmentExclusion(
  academicNameSpaceId: number,
  input: StudentAssessmentExclusionInput[]
) {
  return gqlClient.request(
    studentAssessmentExclusion,
    { input },
    {
      [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNameSpaceId?.toString(),
    }
  );
}
