import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { SchoolBagIcon, BinIcon } from '@tyro/icons';
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
        },
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogTitle display="flex" alignItems="center">
        {isPublished ? (
          <BinIcon sx={{ marginRight: 2 }} />
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
            <SchoolBagIcon />
          </Box>
        )}

        {isPublished
          ? t('schoolActivities:SchoolActivityModalHeaderUnpublish')
          : t('schoolActivities:SchoolActivityModalHeaderPublish')}
      </DialogTitle>
      <DialogContent
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 0,
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'indigo.500',
          },
        }}
      >
        <Alert
          severity="warning"
          icon={false}
          sx={{
            marginBottom: 3,
            backgroundColor: 'indigo.50',
            color: 'indigo.900',
            fontSize: '.0875rem',
            fontWeight: 500,
            '& .MuiAlert-message': {
              paddingY: '18px',
            },
          }}
        >
          <AlertTitle
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
              fontWeight: 500,
            }}
          >
            {isPublished
              ? t('schoolActivities:SchoolActivityModalAlertUnpublish')
              : t('schoolActivities:SchoolActivityModalAlertPublish')}
          </AlertTitle>
        </Alert>
        <DialogContentText>
          {isPublished
            ? t('schoolActivities:SchoolActivityModalBodyUnpublish')
            : t('schoolActivities:SchoolActivityModalBodyPublish')}
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
          {isPublished
            ? t('schoolActivities:confirmUnpublish')
            : t('schoolActivities:confirmPublish')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
