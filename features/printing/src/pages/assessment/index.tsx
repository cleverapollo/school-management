import { Divider, Typography, Card } from '@mui/material';
import {
  AcademicYearDropdown,
  ReturnTypeFromUseAssessments,
  useAssessments,
} from '@tyro/assessments';
import { Autocomplete, PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { useAcademicNamespace } from '@tyro/api';
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
      {academicNameSpaceId && (
        <AcademicYearDropdown
          academicNamespaceId={academicNameSpaceId}
          onChangeAcademicNamespace={setAcademicNameSpaceId}
        />
      )}
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Autocomplete<ReturnTypeFromUseAssessments>
          label={t('common:search')}
          sx={{ maxWidth: 300 }}
          optionIdKey="id"
          optionTextKey="name"
          options={assessmentsData}
          onChange={(_, value) => {
            setAssessment(value as ReturnTypeFromUseAssessments);
          }}
        />
        <Divider textAlign="left" sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('printing:timetable.printOptions')}
          </Typography>
        </Divider>
        <PrintAssessmentForm
          assessment={assessment}
          academicNameSpaceId={academicNameSpaceId}
        />
      </Card>
    </PageContainer>
  );
}
