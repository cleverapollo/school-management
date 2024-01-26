import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Stack, Typography } from '@mui/material';
import { CloudUploadIcon } from '@tyro/icons';

type FileUploaderProps = {
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  uploading: boolean;
};

export const FileUploader = (props: FileUploaderProps) => {
  const { multiple = false, onUpload, uploading } = props;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

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
      <Typography variant="h4">Uploading...</Typography>
    </Stack>
  ) : (
    <Stack
      {...getRootProps()}
      alignItems="center"
      justifyContent="center"
      sx={uploaderSx}
    >
      <input {...getInputProps()} />
      <Typography variant="h4">Upload files</Typography>
      <Stack direction="row" alignItems="center" sx={{ color: 'slate.500' }}>
        <CloudUploadIcon />
        <Typography sx={{ ml: 1 }}>
          {isDragActive
            ? 'Drop the files here ...'
            : "Drag 'n' drop some files here, or click to select files"}
        </Typography>
      </Stack>
    </Stack>
  );
};
