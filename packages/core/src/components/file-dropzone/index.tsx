import { useDropzone } from 'react-dropzone';
import { Stack, Typography } from '@mui/material';
import { CloudUploadIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

type FileUploaderProps = {
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  uploading: boolean;
};

export const FileDropzone = ({
  multiple = false,
  onUpload,
  uploading,
}: FileUploaderProps) => {
  const { t } = useTranslation(['common']);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    multiple,
  });

  const dragDropStrings = multiple
    ? {
        header: t('common:uploadFiles'),
        inactive: t('common:dragNDropFilesHere'),
        active: t('common:dropTheFilesHere'),
      }
    : {
        header: t('common:uploadFile'),
        inactive: t('common:dragNDropFileHere'),
        active: t('common:dropTheFileHere'),
      };

  const dragMessage = isDragActive
    ? dragDropStrings.active
    : dragDropStrings.inactive;

  const uploaderSx = {
    backgroundColor: 'slate.50',
    cursor: 'pointer',
    height: 130,
    borderColor: 'slate.300',
    borderStyle: 'dashed',
    borderRadius: 1.5,
    borderWidth: 1,
  };

  return uploading ? (
    <Stack alignItems="center" justifyContent="center" sx={uploaderSx}>
      <Typography variant="h4">{t('common:uploading')}</Typography>
    </Stack>
  ) : (
    <Stack
      {...getRootProps()}
      alignItems="center"
      justifyContent="center"
      sx={uploaderSx}
    >
      <input {...getInputProps()} />
      <Typography variant="h4">{dragDropStrings.header}</Typography>
      <Stack direction="row" alignItems="center" sx={{ color: 'slate.500' }}>
        <CloudUploadIcon />
        <Typography sx={{ ml: 1 }}>{dragMessage}</Typography>
      </Stack>
    </Stack>
  );
};
