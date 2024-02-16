import { useMutation } from '@tanstack/react-query';
import {
  Forms_SubmitFormInput,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { infoRequestKeys } from './keys';

const saveForm = graphql(/* GraphQL */ `
  mutation forms_submitInformationRequestForms($input: Forms_SubmitFormInput!) {
    forms_submitInformationRequestForms(input: $input) {
      id
      success
      validations {
        fieldErrors
        globalErrors
      }
    }
  }
`);

export function useSaveForm() {
  return useMutation({
    mutationFn: (input: Forms_SubmitFormInput) =>
      gqlClient.request(saveForm, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(infoRequestKeys.all);
    },
  });
}

export type ReturnTypeFromUseSaveForm = UseQueryReturnType<typeof useSaveForm>;
