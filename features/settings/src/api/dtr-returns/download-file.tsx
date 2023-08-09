import { useMutation } from '@tanstack/react-query';
import { fetchClient, useUser } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

export function useDownloadFile() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeProfile } = useUser();

  const downloadFile = async (file: string) => {
    try {
      const data = await fetchClient<string>(`/api/returns/${file}`, {
        method: 'GET',
        bodyType: 'text',
      });

      const tenant = activeProfile?.tenant?.tenant ?? '';
      const twoDigitYear = dayjs().format('YY');
      const prefix = `TF`;
      const fileLetter = file.charAt(file.length - 1);
      const fileExtension = `${twoDigitYear}${fileLetter}`;
      const fileName = `${prefix}${tenant}.${fileExtension}`;

      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, fileName);
    } catch (error) {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    }
  };

  return useMutation({
    mutationFn: downloadFile,
  });
}
