import { Box, Button, Collapse, Fade, Stack, Typography } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  Table,
  TableBooleanValue,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AddIcon } from '@tyro/icons';
import { useAcademicNamespace, UseQueryReturnType } from '@tyro/api';
import { PageContainer } from '../components/page-container';
import { useAssessments } from '../api/assessments';
import { AssessmentActionMenu } from '../components/list-assessments/assessment-action-menu';
import { AcademicYearDropdown } from '../components/list-assessments/academic-year-dropdown';

type ReturnTypeFromUseAssessments = UseQueryReturnType<
  typeof useAssessments
>[number];

const getColumnDefs = (
  translate: TFunction<
    ('assessment' | 'common')[],
    undefined,
    ('assessment' | 'common')[]
  >
): GridOptions<ReturnTypeFromUseAssessments>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('assessment:assessmentName'),
    checkboxSelection: ({ data }) => Boolean(data),
  },
  {
    field: 'assessmentType',
    headerName: translate('assessment:assessmentType'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.assessmentType
        ? translate(`assessment:assessmentTypes.${data.assessmentType}`)
        : '',
  },
  // TODO: waiting for these to be available
  {
    field: 'createdBy',
    headerName: translate('assessment:createdBy'),
  },
  {
    field: 'dateOfCreation',
    headerName: translate('assessment:dateOfCreation'),
  },
  {
    field: 'publish',
    headerName: translate('assessment:publishedOnline'),
    valueGetter: ({ data }) =>
      data?.publish ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) => (
      <TableBooleanValue value={!!data?.publish} />
    ),
  },
];

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessment', 'common']);

  const { activeAcademicNamespace } = useAcademicNamespace();

  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    activeAcademicNamespace?.academicNamespaceId ?? null
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId,
  });

  const [selectedAssessment, setSelectedAssessment] =
    useState<ReturnTypeFromUseAssessments>(null);

  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('assessment:pageTitle.assessments')}>
      <Typography variant="h3" component="h1">
        {t('assessment:pageHeading.assessments')}
      </Typography>
      {academicNameSpaceId && (
        <AcademicYearDropdown
          academicNamespaceId={academicNameSpaceId}
          onChangeAcademicNamespace={setAcademicNameSpaceId}
        />
      )}
      <Table
        rowData={assessmentsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
        rowSelection="single"
        onRowSelection={([newValue]) => setSelectedAssessment(newValue)}
        rightAdornment={
          <Stack direction="row" spacing={1}>
            <Button
              // TODO: add way to create any kind of assessments
              variant="text"
              component={Link}
              to="./term-assessments/create"
              endIcon={<AddIcon />}
            >
              {t('assessment:createTermAssessment')}
            </Button>
            <Collapse
              in={!!selectedAssessment}
              orientation="horizontal"
              unmountOnExit
            >
              <Fade in={!!selectedAssessment}>
                <Box>
                  <AssessmentActionMenu
                    id={selectedAssessment?.id}
                    published={!!selectedAssessment?.publish}
                  />
                </Box>
              </Fade>
            </Collapse>
          </Stack>
        }
      />
    </PageContainer>
  );
}
