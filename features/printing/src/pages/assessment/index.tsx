import { Card, Stack } from '@mui/material';
import { AcademicYearDropdown, useAssessments } from '@tyro/assessments';
import {
  PageContainer,
  PageHeading,
  RHFAutocomplete,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { useAcademicNamespace } from '@tyro/api';
import { FormProvider, useForm } from 'react-hook-form';
import {
  defaultValues,
  PrintAssessmentForm,
  PrintAssessmentFormState,
} from '../../components/assessment/print-assessment-form';

export default function PrintAssessment() {
  const { t } = useTranslation(['common', 'printing', 'assessments']);
  const { resolver, rules } = useFormValidator<PrintAssessmentFormState>();
  const methods = useForm<PrintAssessmentFormState>({
    resolver: resolver({
      assessment: rules.required(),
      orientation: rules.required(),
      colorSetting: rules.required(),
    }),
    defaultValues,
  });

  const { activeAcademicNamespace } = useAcademicNamespace();

  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    activeAcademicNamespace?.academicNamespaceId ?? null
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId: academicNameSpaceId ?? 0,
  });

  useEffect(() => {
    methods.setValue('assessment', undefined);
  }, [academicNameSpaceId]);

  return (
    <FormProvider {...methods}>
      <PageContainer title={t('printing:assessment.title')}>
        <PageHeading title={t('printing:assessment.title')} />
        <Card variant="soft">
          <Stack direction="row" spacing={1}>
            {academicNameSpaceId && (
              <AcademicYearDropdown
                academicNamespaceId={academicNameSpaceId}
                onChangeAcademicNamespace={setAcademicNameSpaceId}
                sx={{
                  '& .MuiSelect-select': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    pt: 3,
                    pb: '7px',
                  },
                }}
              />
            )}
            <RHFAutocomplete
              label={t('assessments:assessment')}
              controlProps={{
                name: 'assessment',
                control: methods.control,
              }}
              sx={{ maxWidth: 300 }}
              optionIdKey="id"
              optionTextKey="name"
              options={assessmentsData}
              fullWidth
              inputProps={{
                variant: 'white-filled',
                InputProps: { fullWidth: true },
                sx: {
                  '& .MuiInputBase-root': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    pt: '17px',
                  },
                },
              }}
            />
          </Stack>
          <PrintAssessmentForm academicNameSpaceId={academicNameSpaceId} />
        </Card>
      </PageContainer>
    </FormProvider>
  );
}
