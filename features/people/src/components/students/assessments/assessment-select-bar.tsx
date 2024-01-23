import { Dispatch, SetStateAction } from 'react';
import { Stack, Button, Fade, useMediaQuery } from '@mui/material';
import { Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AssessmentType } from '@tyro/api';
import {
  AcademicYearDropdown,
  ReturnTypeFromUseStudentDashboardAssessments,
  useStudentAssessmentReportCardSettings,
} from '@tyro/assessments';

interface AssessmentSelectBarProps {
  academicNameSpaceId: number | null;
  setAcademicNameSpaceId: Dispatch<SetStateAction<number | null>>;
  studentAssessments: ReturnTypeFromUseStudentDashboardAssessments;
  selectedAssessment:
    | ReturnTypeFromUseStudentDashboardAssessments[number]
    | null;
  setSelectedAssessment: Dispatch<
    SetStateAction<ReturnTypeFromUseStudentDashboardAssessments[number] | null>
  >;
}

export function AssessmentSelectBar({
  academicNameSpaceId,
  setAcademicNameSpaceId,
  studentAssessments,
  selectedAssessment,
  setSelectedAssessment,
}: AssessmentSelectBarProps) {
  const { t } = useTranslation(['assessments']);
  const wrapItems = useMediaQuery('(max-width: 440px)');
  const { isMobile, isMobileCommentsShowing, toggleIsMobileCommentsShowing } =
    useStudentAssessmentReportCardSettings();

  const filteredStudentAssessments = studentAssessments?.filter(
    (assessment) => assessment.assessmentType !== AssessmentType.StateCba
  );

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
      <Stack
        direction={wrapItems ? 'column' : 'row'}
        spacing={1}
        flex={1}
        width={wrapItems ? '100%' : undefined}
      >
        <AcademicYearDropdown
          academicNamespaceId={academicNameSpaceId ?? 0}
          onChangeAcademicNamespace={setAcademicNameSpaceId}
          sx={{
            maxWidth: wrapItems ? undefined : 300,
          }}
        />
        <Autocomplete
          label={t('assessments:assessment')}
          value={selectedAssessment}
          optionIdKey="id"
          getOptionLabel={({ name }) => name}
          options={filteredStudentAssessments}
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
            filteredStudentAssessments.length
              ? t('assessments:noAssessmentsFound')
              : t('assessments:noAssessmentsAvailable')
          }
          sx={{
            maxWidth: wrapItems ? undefined : 300,
          }}
        />
      </Stack>
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
