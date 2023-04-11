import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, SaveAssessmentInput } from '@tyro/api';

const saveTermAssessment = graphql(/* GraphQL */ `
  mutation saveAssessment($input: SaveAssessmentInput) {
    saveAssessment(input: $input) {
      name
      years {
        year
      }
      startDate
      endDate
      captureTarget
      commentType
      commentBank {
        commentBankId
      }
      commentLength
      capturePrincipalComment
      captureYearHeadComment
      captureTutorComment
      captureHouseMasterComment
      extraFields {
        id
      }
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
