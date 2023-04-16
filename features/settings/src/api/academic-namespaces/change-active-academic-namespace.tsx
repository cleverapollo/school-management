import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlClient, graphql, useCoreAcademicNamespace } from '@tyro/api';
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

type ReturnTypeFromUseCoreAcademicNamespace = NonNullable<
  NonNullable<ReturnType<typeof useCoreAcademicNamespace>['data']>[number]
>;

export function useCoreSetActiveActiveAcademicNamespace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: [
      'coreAcademicNamespace',
      'core_setActiveActiveAcademicNamespace',
    ],
    mutationFn: async (namespace: ReturnTypeFromUseCoreAcademicNamespace) =>
      gqlClient.request(coreSetActiveActiveAcademicNamespace, {
        input: {
          academicNamespaceId: namespace.academicNamespaceId,
        },
      }),
    onSuccess: (_, namespace) => {
      toast(`Successfully changed year to ${namespace.year}`, {
        variant: 'success',
      });
      queryClient.clear();
    },
    onError: (_, namespace) => {
      toast(`Failed changing year to ${namespace.year}`, {
        variant: 'error',
      });
    },
  });
}
