import { useMutation } from '@tanstack/react-query';
import { fetchClient, useUser } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { saveAs } from 'file-saver';

interface DTRReturnResponse {
  filename: string;
  content: string;
}

export function useDownloadFile() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeProfile } = useUser();

  const downloadFile = async (file: string) => {
    try {
      const { filename, content } = await fetchClient<DTRReturnResponse>(
        `/api/returns/${file}`,
        {
          method: 'GET',
          bodyType: 'json',
        }
      );

      if (file === 'FORM_TL') {
        window.open('about:blank', '', '')?.document.write(content);
      } else {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
      }
    } catch (error) {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    }
  };

  return useMutation({
    mutationFn: downloadFile,
  });
}
