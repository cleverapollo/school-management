import React from 'react';
import { useTranslation } from '@tyro/i18n';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAcademicNamespace } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useNumber,
} from '@tyro/core';
import { useAssessmentById } from '../../api/assessments';

export interface ErrorMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId?: string | null;
}

export function ErrorMessageModal({
  isOpen,
  onClose,
  assessmentId,
}: ErrorMessageModalProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;

  const stateCbaId = assessmentId || '-';
  const assessmentIdAsNumber = useNumber(stateCbaId);
  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNamespaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('assessments:existingCbaDefaultTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('assessments:existingCbaErrorMessageText', {
            name: assessmentData?.name,
            yearGroup:
              assessmentData?.yearGroupEnrolments &&
              assessmentData?.yearGroupEnrolments[0]?.name.toLowerCase(),
            academicYear: activeAcademicNamespace?.name.replace('Year', ''),
          })}
        </DialogContentText>
        <Stack direction="column" gap={3} py={3}>
          <DialogContentText
            component={Link}
            variant="body2"
            to={`/assessments/${academicNamespaceIdAsNumber}/state-cba-assessments/${stateCbaId}`}
          >
            {t('assessments:viewExistingCba')}
          </DialogContentText>
          <DialogContentText
            component={Link}
            variant="body2"
            to={`/assessments/${academicNamespaceIdAsNumber}/state-cba-assessments/${stateCbaId}/edit`}
          >
            {t('assessments:editExistingCba')}
          </DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="soft" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
