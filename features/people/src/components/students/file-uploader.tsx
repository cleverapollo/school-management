import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Stack, Typography } from '@mui/material';
import { CloudUploadIcon } from '@tyro/icons';

export const FileUploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Stack
      {...getRootProps()}
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: 'slate.50',
        cursor: 'pointer',
        height: 130,
        borderColor: 'slate.300',
        borderStyle: 'dashed',
        borderRadius: 1.5,
        borderWidth: 1,
      }}
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
