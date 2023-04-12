import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, SaveAssessmentInput } from '@tyro/api';

const saveTermAssessment = graphql(/* GraphQL */ `
  mutation saveAssessment($input: SaveAssessmentInput) {
    assessment_saveAssessment(input: $input) {
      name
      years {
        year
      }
      startDate
      endDate
    }
  }
`);

export function useSaveTermAssessment() {
  return useMutation({
    mutationKey: ['termAssessment', 'createTermAssessment'],
    mutationFn: (input: SaveAssessmentInput) =>
      gqlClient.request(saveTermAssessment, { input }),
  });
}
