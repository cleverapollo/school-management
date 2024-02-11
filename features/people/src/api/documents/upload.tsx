import { fetchClient, queryClient } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

export function useUploadDocument(studentId: number | undefined) {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('referenceId', `${studentId ?? ''}`);
      formData.append('overwrite', 'false');

      return fetchClient('/api/file-transfer/STUDENT_DOCS', {
        method: 'POST',
        bodyType: 'formData',
        body: formData,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.students.allDocuments());
      toast(t('common:snackbarMessages.uploadSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
