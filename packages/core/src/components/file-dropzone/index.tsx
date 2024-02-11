import { useDropzone } from 'react-dropzone';
import { Stack, Typography } from '@mui/material';
import { CloudUploadIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '../../hooks';

type FileUploaderProps = {
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  uploading: boolean;
  maxFileSizeInKiloBytes?: number;
};

function getFileSizeLabel(sizeInKiloByte: number) {
  if (sizeInKiloByte < 1024) {
    return `${sizeInKiloByte} KB`;
  }

  if (sizeInKiloByte < 1024 * 1024) {
    return `${Math.round(sizeInKiloByte / 1024)} MB`;
  }

  return `${Math.round(sizeInKiloByte / (1024 * 1024))} GB`;
}

export const FileDropzone = ({
  multiple = false,
  onUpload,
  uploading,
  maxFileSizeInKiloBytes = 1024 * 10,
}: FileUploaderProps) => {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  const maxFileSizeLabel = getFileSizeLabel(maxFileSizeInKiloBytes);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const { code } = rejectedFiles[0].errors[0];

        if (code === 'file-too-large') {
          toast(
            t('common:errorMessages.fileSize', { size: maxFileSizeLabel }),
            { variant: 'error' }
          );
        } else {
          toast(t('common:snackbarMessages.errorUploadingFile'), {
            variant: 'error',
          });
        }

        return;
      }

      onUpload(acceptedFiles);
    },
    multiple,
    maxSize: maxFileSizeInKiloBytes * 1024,
    onError: (error) => {
      console.error(error);
    },
  });

  const dragDropStrings = multiple
    ? {
        header: t('common:uploadFiles'),
        inactive: t('common:dragNDropFilesHere', {
          maxSize: maxFileSizeLabel,
        }),
        active: t('common:dropTheFilesHere'),
      }
    : {
        header: t('common:uploadFile'),
        inactive: t('common:dragNDropFileHere', {
          maxSize: maxFileSizeLabel,
        }),
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
