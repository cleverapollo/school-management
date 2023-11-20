import { useMutation } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
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
      toast(t('common:snackbarMessages.publishedOnline'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
