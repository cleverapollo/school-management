import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  Table,
  TableLinearProgress,
  useNumber,
  PageContainer,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  useResponsive,
} from '@tyro/core';
import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Button, Typography } from '@mui/material';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { useAssessmentById } from '../../api/assessments';

const getColumnDefs = (
  isDesktop: boolean,
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroup.name',
    headerName: t('common:name'),
    sort: 'asc',
    suppressSizeToFit: isDesktop,
  },
  {
    field: 'subjectGroup.subjects',
    headerName: t('common:subject'),
    valueGetter: ({ data }) =>
      data?.subjectGroup.subjects
        ?.map((subject) => subject?.name ?? '')
        .join(', '),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography variant="body2" noWrap>
          {data?.subjectGroup.subjects
            ?.map((subject) => subject?.name ?? '')
            .join(', ')}
        </Typography>
      ),
  },
  {
    field: 'subjectGroup.staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.subjectGroup.staff),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography variant="body2" noWrap>
          {displayNames(data?.subjectGroup.staff)}
        </Typography>
      ),
  },
  {
    headerName: t('common:year'),
    field: 'subjectGroup.yearGroups',
    enableRowGroup: true,
    filter: true,
    valueGetter: ({ data }) =>
      data?.subjectGroup.yearGroups
        ?.sort((a, b) => a.yearGroupId - b.yearGroupId)
        .map((year) => year?.name)
        .join(', '),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography component="span" variant="body2" noWrap>
          {data?.subjectGroup.yearGroups
            ?.sort((a, b) => a.yearGroupId - b.yearGroupId)
            .map((year) => year?.name)
            .join(', ')}
        </Typography>
      ),
  },
  {
    field: 'resultsTotal',
    headerName: t('assessments:results'),
    suppressSizeToFit: true,
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
    suppressSizeToFit: true,
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
    field: 'editResults',
    headerName: '',
    suppressSizeToFit: true,
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
  const { displayNames } = usePreferredNameLayout();

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

  const isDesktop = useResponsive('up', 'md');

  const columnDefs = useMemo(
    () => getColumnDefs(!!isDesktop, t, displayNames),
    [t, displayNames]
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
        onFirstDataRendered={(params) => {
          params.columnApi.autoSizeColumns([
            'subjectGroup.name',
            'resultsTotal',
            'commentsTotal',
            'editResults',
          ]);
          params.api.sizeColumnsToFit();
        }}
      />
    </PageContainer>
  );
}
