import { Dispatch, SetStateAction, useEffect } from 'react';
import { Stack } from '@mui/material';
import { Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ReturnTypeFromUseStudentDashboardAssessments,
  useStudentDashboardAssessments,
} from '@tyro/assessments';

interface AssessmentSelectBarProps {
  studentId: number | undefined;
  selectedAssessment:
    | ReturnTypeFromUseStudentDashboardAssessments[number]
    | null;
  setSelectedAssessment: Dispatch<
    SetStateAction<ReturnTypeFromUseStudentDashboardAssessments[number] | null>
  >;
}

export function AssessmentSelectBar({
  studentId,
  selectedAssessment,
  setSelectedAssessment,
}: AssessmentSelectBarProps) {
  const { t } = useTranslation(['assessments']);
  const { data: studentAssessments = [] } = useStudentDashboardAssessments(
    {
      studentPartyId: studentId ?? 0,
    },
    !!studentId
  );

  useEffect(() => {
    if (studentAssessments.length && !selectedAssessment) {
      setSelectedAssessment(studentAssessments[0]);
    }
  }, [studentAssessments]);

  return (
    <Stack direction="row">
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
        inputProps={{
          variant: 'white-filled',
        }}
        noOptionsText={
          studentAssessments.length
            ? t('assessments:noAssessmentsFound')
            : t('assessments:noAssessmentsAvailable')
        }
        sx={{
          maxWidth: 300,
        }}
      />
    </Stack>
  );
}
