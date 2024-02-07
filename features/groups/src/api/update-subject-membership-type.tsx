import { useMutation } from '@tanstack/react-query';
import {
  Core_ModifySubjectGroupMembershipType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

const updateSubjectGroupsMembershipType = graphql(/* GraphQL */ `
  mutation core_modifySubjectGroupMembershipType(
    $input: [Core_ModifySubjectGroupMembershipType]!
  ) {
    core_modifySubjectGroupMembershipType(input: $input) {
      success
    }
  }
`);

export function useUpdateSubjectGroupsMembershipType() {
  return useMutation({
    mutationFn: (input: Core_ModifySubjectGroupMembershipType[]) =>
      gqlClient.request(updateSubjectGroupsMembershipType, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
