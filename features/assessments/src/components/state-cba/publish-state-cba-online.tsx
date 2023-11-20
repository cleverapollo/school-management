import React, { useEffect } from 'react';
import { useTranslation } from '@tyro/i18n';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@tyro/core';
import { PublishAssessmentInput } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { usePublishStateCbaOnline } from '../../api/state-cba/publish-state-cba-to-parents';
import { ReturnTypeFromUseAssessmentSubjectGroups } from '../../api/assessment-subject-groups';

dayjs.extend(LocalizedFormat);

export interface ApprovePublishOnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState: ReturnTypeFromUseAssessmentSubjectGroups[];
  assessmentId?: number;
}

export function PublishOnlineModal({
  isOpen,
  onClose,
  initialState,
  assessmentId = 0,
}: ApprovePublishOnlineModalProps) {
  const { t } = useTranslation(['common', 'assessments']);

  const {
    mutateAsync: publishOnline,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = usePublishStateCbaOnline();

  const onSubmit = () => {
    const subjectGroupIds = initialState?.map(
      (subject) => subject?.subjectGroup?.partyId
    );

    const getDate = dayjs().format('YYYY-MM-DD');

    const formattedData: PublishAssessmentInput = {
      assessmentId,
      subjectGroupIds,
      publish: true,
      publishFrom: getDate,
    };

    publishOnline(formattedData);
  };

  const subjectGroupNames = initialState?.map(
    (subject) => subject?.subjectGroup?.name
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('assessments:publishOnline')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('assessments:publishOnlineModalText', {
            count: subjectGroupNames?.length,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="soft" loading={isSubmitting} onClick={onSubmit}>
          {t('common:actions.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
