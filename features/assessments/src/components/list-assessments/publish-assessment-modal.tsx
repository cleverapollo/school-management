import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useFormValidator,
  RHFDatePicker,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ReturnTypeFromUseAssessments } from '../../api/assessments';
import { usePublishAssessmentBasedOnType } from '../../api/publish-assessments';

interface PublishAssessmentModalProps {
  assessmentId: number;
  publishedFrom: ReturnTypeFromUseAssessments['publishedFrom'];
  open: boolean;
  onClose: () => void;
  isTermAssessment: boolean;
}

interface PublishFormValues {
  publishDate: Dayjs;
}

export function PublishAssessmentModal({
  assessmentId,
  publishedFrom,
  open,
  onClose,
  isTermAssessment,
}: PublishAssessmentModalProps) {
  const { t } = useTranslation(['common', 'assessments']);

  const { resolver, rules } = useFormValidator<PublishFormValues>();

  const { control, handleSubmit, reset } = useForm<PublishFormValues>({
    resolver: resolver({
      publishDate: rules.required(),
    }),
    defaultValues: {
      publishDate: dayjs(publishedFrom),
    },
  });

  const { publish, isSubmitting, isSubmittingStateCba } =
    usePublishAssessmentBasedOnType(assessmentId, isTermAssessment);

  const onSubmit = handleSubmit(({ publishDate }) => {
    publish(publishDate, onClose);
  });

  useEffect(() => {
    if (open) {
      reset({
        publishDate: dayjs(publishedFrom),
      });
    }
  }, [open, publishedFrom]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('assessments:whenWouldYouLikeToPublish')}
      </DialogTitle>
      <DialogContent>
        <Box pt={1}>
          <RHFDatePicker
            label={t('assessments:publishDate')}
            controlProps={{
              control,
              name: 'publishDate',
            }}
            inputProps={{
              fullWidth: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="soft" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={isSubmitting || isSubmittingStateCba}
          onClick={onSubmit}
        >
          {t('assessments:publish')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
