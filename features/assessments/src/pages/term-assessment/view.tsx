import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  RouterLink,
  Table,
  TableLinearProgress,
  useNumber,
} from '@tyro/core';
import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Button } from '@mui/material';
import { PageContainer } from '../../components/page-container';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { useAssessmentById } from '../../api/assessments';

const getColumnDefs = (
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroupName',
    headerName: t('common:name'),
  },
  {
    field: 'subject',
    headerName: t('common:subject'),
    enableRowGroup: true,
  },
  {
    field: 'resultsTotal',
    headerName: t('assessments:results'),
    valueGetter: ({ data }) =>
      data && `${data?.resultsEntered ?? '-'}/${data?.resultsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <TableLinearProgress
          value={data?.resultsEntered}
          total={data?.resultsTotal}
        />
      ),
  },
  {
    field: 'commentsTotal',
    headerName: t('assessments:comments'),
    valueGetter: ({ data }) =>
      data && `${data?.commentsEntered ?? '-'}/${data?.commentsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <TableLinearProgress
          value={data?.commentsEntered}
          total={data?.commentsTotal}
        />
      ),
  },
  {
    headerName: '',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups, any>) =>
      data && (
        <Button
          className="ag-show-on-row-interaction"
          component={Link}
          to={`./subject-group/${data.subjectGroupId}`}
        >
          {t('assessments:actions.editResults')}
        </Button>
      ),
  },
];

export default function ViewTermAssessment() {
  const { t } = useTranslation(['assessments', 'common']);

  const { assessmentId: paramId } = useParams();
  const assessmentId = useNumber(paramId);

  const { data: assessmentData } = useAssessmentById(assessmentId ?? 0);
  const { data: assessmentSubjectGroupsData = [] } = useAssessmentSubjectGroups(
    {
      assessmentId,
    }
  );

  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer
      title={t('assessments:pageTitle.termAssessmentSubjectGroups')}
    >
      <PageHeading
        title={t('assessments:pageHeading.termAssessmentSubjectGroups', {
          name: assessmentData?.name,
        })}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: t('assessments:pageHeading.termAssessmentSubjectGroups', {
                name: assessmentData?.name,
              }),
            },
          ],
        }}
      />
      <Table
        rowData={assessmentSubjectGroupsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.subjectGroupId)}
      />
    </PageContainer>
  );
}
