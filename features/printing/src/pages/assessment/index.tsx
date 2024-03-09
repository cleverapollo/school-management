import { Divider, Typography, Card, Stack } from '@mui/material';
import {
  AcademicYearDropdown,
  ReturnTypeFromUseAssessments,
  useAssessments,
} from '@tyro/assessments';
import { Autocomplete, PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { useAcademicNamespace } from '@tyro/api';
import { SearchIcon } from '@tyro/icons';
import PrintAssessmentForm from '../../components/assessment/print-assessment-form';

export default function PrintAssessment() {
  const { t } = useTranslation(['common', 'printing']);
  const [assessment, setAssessment] = useState<
    ReturnTypeFromUseAssessments | undefined
  >();

  const { activeAcademicNamespace } = useAcademicNamespace();

  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    activeAcademicNamespace?.academicNamespaceId ?? null
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId: academicNameSpaceId ?? 0,
  });

  return (
    <PageContainer title={t('printing:assessment.title')}>
      <PageHeading title={t('printing:assessment.title')} />
      <Card variant="soft">
        <Stack direction="row" spacing={1} pb={2}>
          <Autocomplete<ReturnTypeFromUseAssessments>
            label={t('common:search')}
            sx={{ maxWidth: 300 }}
            optionIdKey="id"
            optionTextKey="name"
            options={assessmentsData}
            fullWidth
            onChange={(_, value) => {
              setAssessment(value as ReturnTypeFromUseAssessments);
            }}
            inputProps={{
              variant: 'filled',
              InputProps: { fullWidth: true },
            }}
          />
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
        </Stack>
        <PrintAssessmentForm
          assessment={assessment}
          academicNameSpaceId={academicNameSpaceId}
        />
      </Card>
    </PageContainer>
  );
}
