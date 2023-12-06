import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useFormValidator,
  RHFDatePicker,
  useToast,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ReturnTypeFromUseAssessments,
  usePublishAssessment,
} from '../../api/assessments';
import { usePublishStateCbaOnline } from '../../api/state-cba/publish-state-cba-to-parents';
import { getAssessmentSubjectGroups } from '../../api/assessment-subject-groups';

interface PublishAssessmentModalProps {
  assessmentId: number;
  publishedFrom: ReturnTypeFromUseAssessments['publishedFrom'];
  open: boolean;
  onClose: () => void;
  isTermAssessment: boolean;
  academicNamespaceIdAsNumber: number;
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
  academicNamespaceIdAsNumber,
}: PublishAssessmentModalProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const { toast } = useToast();

  const { resolver, rules } = useFormValidator<PublishFormValues>();

  const { control, handleSubmit, reset } = useForm<PublishFormValues>({
    resolver: resolver({
      publishDate: rules.required(),
    }),
    defaultValues: {
      publishDate: dayjs(publishedFrom),
    },
  });

  const { mutateAsync: publishAssessment, isLoading: isSubmitting } =
    usePublishAssessment();

  const { mutateAsync: publishStateCba, isLoading: isSubmittingStateCba } =
    usePublishStateCbaOnline();

  const onSubmit = handleSubmit(async ({ publishDate }) => {
    if (isTermAssessment) {
      publishAssessment(
        {
          assessmentId,
          publish: true,
          publishFrom: publishDate.format('YYYY-MM-DD'),
        },
        {
          onSuccess: () => {
            onClose();
            toast(t('common:snackbarMessages.updateSuccess'));
          },
        }
      );
    } else {
      try {
        const response = await getAssessmentSubjectGroups(
          academicNamespaceIdAsNumber,
          {
            assessmentId,
          }
        );

        const data = response?.assessment_assessmentSubjectGroups;
        const subjectGroupIds = data?.map(
          (subject) => subject?.subjectGroup?.partyId
        );

        publishStateCba(
          {
            assessmentId,
            subjectGroupIds,
            publish: true,
            publishFrom: publishDate.format('YYYY-MM-DD'),
          },
          {
            onSuccess: () => {
              onClose();
              toast(t('common:snackbarMessages.updateSuccess'));
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
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
          loading={isTermAssessment ? isSubmitting : isSubmittingStateCba}
          onClick={onSubmit}
        >
          {t('assessments:publish')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
