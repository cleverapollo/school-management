import React, { useEffect } from 'react';
import {
  Button,
  Stack,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  useFormValidator,
  DialogActions,
  Dialog,
  DialogTitle,
} from '@tyro/core';

import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

export const BulkAttendanceModal = () => {
  const { t, i18n } = useTranslation(['common', 'attendance']);

  const handleClose = () => {
    console.log('close');
  };

  return (
    <Dialog open onClose={handleClose} scroll="paper" fullWidth maxWidth="sm">
      <DialogTitle>Create bulk attendance</DialogTitle>
    </Dialog>
  );
};
