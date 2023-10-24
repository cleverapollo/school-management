import { Dispatch, SetStateAction } from 'react';
import { Stack, Button, Fade, useMediaQuery } from '@mui/material';
import { Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ReturnTypeFromUseStudentDashboardAssessments,
  useStudentAssessmentReportCardSettings,
} from '@tyro/assessments';

interface AssessmentSelectBarProps {
  studentAssessments: ReturnTypeFromUseStudentDashboardAssessments;
  selectedAssessment:
    | ReturnTypeFromUseStudentDashboardAssessments[number]
    | null;
  setSelectedAssessment: Dispatch<
    SetStateAction<ReturnTypeFromUseStudentDashboardAssessments[number] | null>
  >;
}

export function AssessmentSelectBar({
  studentAssessments,
  selectedAssessment,
  setSelectedAssessment,
}: AssessmentSelectBarProps) {
  const { t } = useTranslation(['assessments']);
  const wrapItems = useMediaQuery('(max-width: 440px)');
  const { isMobile, isMobileCommentsShowing, toggleIsMobileCommentsShowing } =
    useStudentAssessmentReportCardSettings();

  return (
    <Stack
      direction={wrapItems ? 'column' : 'row'}
      spacing={wrapItems ? 1 : 0}
      sx={
        wrapItems
          ? { justifyContent: 'flex-start', alignItems: 'flex-start' }
          : { justifyContent: 'space-between', alignItems: 'center' }
      }
    >
      <Autocomplete
        label={t('assessments:assessment')}
        value={selectedAssessment}
        optionIdKey="id"
        getOptionLabel={({ name }) => name}
        options={studentAssessments}
        isOptionEqualToValue={(option, { id }) => option.id === id}
        onChange={(_event, newValue) => {
          const extractedValue = Array.isArray(newValue)
            ? newValue[0]
            : newValue;
          setSelectedAssessment(extractedValue);
        }}
        fullWidth
        disableClearable
        inputProps={{
          variant: 'white-filled',
        }}
        noOptionsText={
          studentAssessments.length
            ? t('assessments:noAssessmentsFound')
            : t('assessments:noAssessmentsAvailable')
        }
        sx={{
          maxWidth: wrapItems ? undefined : 300,
        }}
      />
      <Fade in={isMobile} unmountOnExit>
        <Button variant="text" onClick={toggleIsMobileCommentsShowing}>
          {isMobileCommentsShowing
            ? t('assessments:hideComments')
            : t('assessments:showComments')}
        </Button>
      </Fade>
    </Stack>
  );
}
