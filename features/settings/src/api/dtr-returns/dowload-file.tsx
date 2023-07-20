import { useMutation } from '@tanstack/react-query';
import { fetchClientText, useAcademicNamespace, useUser } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export function useDownloadFileB() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeProfile } = useUser();
  const { activeAcademicNamespace } = useAcademicNamespace();

  return useMutation({
    mutationFn: () =>
      fetchClientText<string>('/api/returns/FILE_B', { method: 'GET' }),
    onSuccess: (data) => {
      const tenant = activeProfile?.tenant?.tenant ?? '';
      const twoDigitYear = (activeAcademicNamespace?.year ?? 0) % 100;
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `TF${tenant}.${twoDigitYear}B`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
