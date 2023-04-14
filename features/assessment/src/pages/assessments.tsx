import { Button, Typography } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  Table,
  TableBooleanValue,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/page-container';
import { useAssessments } from '../api/assessments';
import { AssessmentActionMenu } from '../components/list-assessments/assessment-action-menu';
import { AcademicYearDropdown } from '../components/list-assessments/academic-year-dropdown';

type ReturnTypeFromUseAssessments = NonNullable<
  ReturnType<typeof useAssessments>['data']
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
  },
  {
    field: 'assessmentType',
    headerName: translate('assessment:assessmentType'),
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
  {
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
      data && <AssessmentActionMenu id={data.id} published={!!data.publish} />,
  },
];

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessment', 'common']);

  const { data: assessmentsData = [] } = useAssessments({});
  const columnDefs = getColumnDefs(t);

  return (
    <PageContainer title={t('assessment:pageTitle.assessments')}>
      <Typography variant="h3" component="h1">
        {t('assessment:pageHeading.assessments')}
      </Typography>
      <Table
        rowData={assessmentsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
        topAdornment={
          <AcademicYearDropdown
            academicNamespaceId={assessmentsData[0]?.academicNamespaceId ?? 0}
            // TODO: add ability to switch to previous academic years
            onChangeAcademicNamespace={console.log}
          />
        }
        rightAdornment={
          // TODO: add way to create any kind of assessments
          <Button
            variant="contained"
            component={Link}
            to="./term-assessments/create"
          >
            {t('assessment:createTermAssessment')}
          </Button>
        }
      />
    </PageContainer>
  );
}
