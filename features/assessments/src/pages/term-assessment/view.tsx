import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TableLinearProgress,
  useNumber,
  PageContainer,
  usePreferredNameLayout,
} from '@tyro/core';
import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Button } from '@mui/material';
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
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroup.name',
    headerName: t('common:name'),
  },
  {
    field: 'subjectGroup.subjects',
    headerName: t('common:subject'),
    valueGetter: ({ data }) =>
      data?.subjectGroup.subjects
        ?.map((subject) => subject?.name ?? '')
        .join(', '),
    enableRowGroup: true,
  },
  {
    field: 'subjectGroup.staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) =>
      data?.subjectGroup.staff?.map((person) => displayName(person)).join(', '),
    enableRowGroup: true,
    sort: 'asc',
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
          to={`./subject-group/${data.subjectGroup.partyId}`}
        >
          {t('assessments:actions.editResults')}
        </Button>
      ),
  },
];

export default function ViewTermAssessment() {
  const { t } = useTranslation(['assessments', 'common']);

  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const { displayName } = usePreferredNameLayout();

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: assessmentSubjectGroupsData = [] } = useAssessmentSubjectGroups(
    academicNameSpaceIdAsNumber ?? 0,
    {
      assessmentId: assessmentIdAsNumber,
    }
  );

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

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
        getRowId={({ data }) => String(data?.subjectGroup.partyId)}
      />
    </PageContainer>
  );
}
