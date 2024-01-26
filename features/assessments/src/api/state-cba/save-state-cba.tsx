import { useMutation } from '@tanstack/react-query';
import {
  BackendErrorResponse,
  EmulateHeaders,
  gqlClient,
  graphql,
  ParsedErrorDetail,
  queryClient,
  SaveStateCbaAssessmentInput,
  useAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const saveStateCba = graphql(/* GraphQL */ `
  mutation assessment_saveStateCbaAssessment(
    $input: SaveStateCbaAssessmentInput
  ) {
    assessment_saveStateCbaAssessment(input: $input) {
      id
      academicNamespaceId
      name
      assessmentType
      startDate
      endDate
      yearGroupIds
      years {
        yearGroupId
        name
      }
      extraFields {
        id
        name
        assessmentId
        extraFieldType
        gradeSetId
        commentBankId
        commentBankName
        selectOptions
        commentLength
      }
      createdBy {
        partyId
        firstName
        lastName
        avatarUrl
      }
    }
  }
`);

export function useSaveStateCba(academicNameSpaceId?: number) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeAcademicNamespace } = useAcademicNamespace();

  return useMutation({
    mutationFn: (input: SaveStateCbaAssessmentInput) =>
      gqlClient.request(
        saveStateCba,
        { input },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: (
            academicNameSpaceId ??
            activeAcademicNamespace?.academicNamespaceId ??
            0
          )?.toString(),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: (error: unknown) => {
      let errorMessage = t('common:snackbarMessages.errorFailed');

      if (typeof error === 'object' && error !== null) {
        const backendError = error as BackendErrorResponse;
        try {
          const parsedError = JSON.parse(
            backendError.response.error
          ) as ParsedErrorDetail;
          errorMessage = parsedError.detail || errorMessage;
        } catch (parseError) {
          console.error('Error parsing the error message:', parseError);
        }
      }

      const errorToastMessage = errorMessage?.replace(/\..*/, '');
      toast(errorToastMessage, { variant: 'error' });
    },
  });
}
