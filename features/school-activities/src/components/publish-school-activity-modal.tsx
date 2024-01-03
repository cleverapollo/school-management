import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { SchoolBagIcon, TrashIcon } from '@tyro/icons';
import { usePublishSchoolActivity } from '../api/publish_school_activity';

type PublishSchoolActivityProps = {
  open: boolean;
  onClose: () => void;
  isPublished: boolean;
  schoolActivityId: number;
};

export function PublishSchoolActivityModal({
  open,
  onClose,
  isPublished,
  schoolActivityId,
}: PublishSchoolActivityProps) {
  const { t } = useTranslation(['common', 'schoolActivities']);
  const [isSchoolActivityPublished, setIsSchoolActivityPublished] =
    useState(isPublished);

  const { mutateAsync: publishSchoolActivity, isLoading } =
    usePublishSchoolActivity();

  const onSubmit = () => {
    publishSchoolActivity(
      {
        schoolActivityId,
        setAsPublished: !isPublished,
      },
      {
        onSuccess: () => {
          onClose();
          setTimeout(() => {
            setIsSchoolActivityPublished(!isPublished);
          }, 300);
        },
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogTitle display="flex" alignItems="center">
        {isSchoolActivityPublished ? (
          <TrashIcon sx={{ marginRight: 2 }} />
        ) : (
          <Box
            width="45px"
            height="45px"
            sx={{
              backgroundColor: 'blue.600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '1rem',
              marginRight: 2,
            }}
          >
            <SchoolBagIcon sx={{ color: 'blue.100' }} />
          </Box>
        )}

        {isSchoolActivityPublished
          ? t('schoolActivities:schoolActivityModalTitleUnpublish')
          : t('schoolActivities:schoolActivityModalTitlePublish')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSchoolActivityPublished
            ? t('schoolActivities:schoolActivityModalTextUnpublish')
            : t('schoolActivities:schoolActivityModalTextPublish')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="soft" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={isLoading}
          onClick={onSubmit}
        >
          {isSchoolActivityPublished
            ? t('schoolActivities:confirmUnpublish')
            : t('schoolActivities:confirmPublish')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
