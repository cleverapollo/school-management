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
import { usePublishResultsToPpod } from '../../api/state-cba/publish-ppod-results';
import { ReturnTypeFromUseAssessmentSubjectGroups } from '../../api/assessment-subject-groups';
import { ReturnTypeFromUseAssessmentResults } from '../../api/assessment-results';

export interface ApproveAbsentRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState: ReturnTypeFromUseAssessmentSubjectGroups[];
  assessmentId?: number;
  studentResults?: ReturnTypeFromUseAssessmentResults[];
}

type ResultsIds = number;

export function SyncWithPpodModal({
  isOpen,
  onClose,
  initialState,
  assessmentId = 0,
  studentResults,
}: ApproveAbsentRequestConfirmModalProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const { mutateAsync: publishResultsToPpod, isLoading: isSubmitting } =
    usePublishResultsToPpod();

  const onSubmit = () => {
    const subjectGroupIds = initialState?.map(
      (subject) => subject?.subjectGroup?.partyId
    );

    const resultIds = studentResults?.reduce<ResultsIds[]>((acc, student) => {
      if (student?.id) {
        acc.push(student?.id);
      }
      return acc;
    }, []);

    publishResultsToPpod(
      {
        assessmentId,
        subjectGroupIds,
        resultIds: resultIds ?? [],
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('assessments:syncWithPpod')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('assessments:syncWithPpodModalText')}
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
