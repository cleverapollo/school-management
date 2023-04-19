import { TFunction, useTranslation } from '@tyro/i18n';
import { GridOptions, PageHeading, Table, useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { PageContainer } from '../../components/page-container';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';

const getColumnDefs = (
  translate: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroupName',
    headerName: translate('common:name'),
  },
  {
    field: 'subject',
    headerName: translate('common:subject'),
    enableRowGroup: true,
  },
  {
    field: 'resultsTotal',
    headerName: translate('assessments:results'),
    valueGetter: ({ data }) =>
      data && `${data?.resultsEntered ?? '-'}/${data?.resultsTotal ?? '-'}`,
  },
  {
    field: 'commentsTotal',
    headerName: translate('assessments:comments'),
    valueGetter: ({ data }) =>
      data && `${data?.commentsEntered ?? '-'}/${data?.commentsTotal ?? '-'}`,
  },
];

export default function AssessmentSubjectGroupsPage() {
  const { t } = useTranslation(['assessments', 'common']);

  const { assessmentId: paramId } = useParams();
  const assessmentId = useNumber(paramId);

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
          // TODO: get assessment name from response
          name: 'Easter 2023',
        })}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: t('assessments:pageHeading.termAssessmentSubjectGroups', {
                // TODO: get assessment name from response
                name: 'Easter 2023',
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
