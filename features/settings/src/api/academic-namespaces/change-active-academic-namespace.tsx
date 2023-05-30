import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  coreAcademicNamespaceKeys,
  gqlClient,
  graphql,
  ReturnTypeFromUseCoreAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';

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

export function useCoreSetActiveActiveAcademicNamespace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: coreAcademicNamespaceKeys.activeAcademicNamespace(),
    mutationFn: async (
      namespace: NonNullable<ReturnTypeFromUseCoreAcademicNamespace>
    ) =>
      gqlClient.request(coreSetActiveActiveAcademicNamespace, {
        input: {
          academicNamespaceId: namespace.academicNamespaceId,
        },
      }),
    onSuccess: (_: any, namespace: ReturnTypeFromUseCoreAcademicNamespace) => {
      toast(`Successfully changed year to ${namespace.year}`, {
        variant: 'success',
      });
      queryClient.clear();
    },
    onError: (_, namespace: ReturnTypeFromUseCoreAcademicNamespace) => {
      toast(`Failed changing year to ${namespace.year}`, {
        variant: 'error',
      });
    },
  });
}
