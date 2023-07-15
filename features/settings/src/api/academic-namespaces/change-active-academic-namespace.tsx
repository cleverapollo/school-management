import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  ReturnTypeFromUseCoreAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { academicNamspaceKeys } from './keys';

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
  const { t } = useTranslation(['settings']);

  return useMutation({
    mutationKey: academicNamspaceKeys.activeAcademicNamespace(),
    mutationFn: async (
      namespace: NonNullable<ReturnTypeFromUseCoreAcademicNamespace>
    ) =>
      gqlClient.request(coreSetActiveActiveAcademicNamespace, {
        input: {
          academicNamespaceId: namespace?.academicNamespaceId,
        },
      }),
    onSuccess: (_, namespace) => {
      toast(t(`settings:successfullyChangedYear`, { name: namespace.name }), {
        variant: 'success',
      });
      queryClient.clear();
      window.location.reload();
    },
    onError: (_, namespace) => {
      toast(t(`settings:failedChangingYear`, { name: namespace.name }), {
        variant: 'error',
      });
    },
  });
}
