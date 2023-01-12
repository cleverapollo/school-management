import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlClient, graphql, SetActiveAcademicNamespace } from '@tyro/api';

const coreSetActiveActiveAcademicNamespace = graphql(/* GraphQL */ `
  mutation core_setActiveActiveAcademicNamespace(
    $input: SetActiveAcademicNamespace
  ) {
    core_setActiveActiveAcademicNamespace(input: $input) {
      academicNamespaceId
      type
      name
      year
      description
      isActiveDefaultNamespace
    }
  }
`);

export interface CoreSetActiveActiveAcademicNamespaceWrapper {
  mutationBody: SetActiveAcademicNamespace;
  displayChangeToYear: number;
}
export function useCoreSetActiveActiveAcademicNamespace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [
      'coreAcademicNamespace',
      'core_setActiveActiveAcademicNamespace',
    ],
    mutationFn: async (input: CoreSetActiveActiveAcademicNamespaceWrapper) =>
      gqlClient.request(coreSetActiveActiveAcademicNamespace, {
        input: input.mutationBody,
      }),
    onSuccess: (a, b) => {
      console.log(`Successfully changed year to ${b.displayChangeToYear}`);
      queryClient.clear();
    },
    onError: (a, b) => {
      console.log(`Failed changing year to ${b.displayChangeToYear}`);
    },
  });
}
