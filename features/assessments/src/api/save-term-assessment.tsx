import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentInput,
} from '@tyro/api';
import { assessmentsKeys } from './keys';

const saveTermAssessment = graphql(/* GraphQL */ `
  mutation saveAssessment($input: SaveAssessmentInput) {
    assessment_saveAssessment(input: $input) {
      name
      years {
        name
      }
      startDate
      endDate
      extraFields {
        id
        assessmentId
        name
        extraFieldType
        commentBankId
        commentLength
      }
    }
  }
`);

export function useSaveTermAssessment() {
  return useMutation({
    mutationFn: (input: SaveAssessmentInput) =>
      gqlClient.request(saveTermAssessment, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(assessmentsKeys.all);
    },
  });
}
