import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  RouterLink,
  Table,
  TableBooleanValue,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  ReturnTypeFromUseInfoRequestFormList,
  useInfoRequestFormList,
} from '../api/form-list';

const getColumnDefs = (
  t: TFunction<'common'[], undefined, 'common'[]>
): GridOptions<ReturnTypeFromUseInfoRequestFormList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseInfoRequestFormList>) =>
      data && <RouterLink to={`./view/${data.id}`}>{data.name}</RouterLink>,
  },
  {
    field: 'isComplete',
    headerName: t('common:complete'),
    valueGetter: ({ data }) => {
      if (!data) return null;

      return data.isComplete ? t('common:yes') : t('common:no');
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseInfoRequestFormList>) => {
      if (!data) return null;

      return <TableBooleanValue value={!!data.isComplete} />;
    },
  },
];

export default function InfoRequestFormList() {
  const { t } = useTranslation(['common', 'infoRequests']);

  const { data: infoRequests } = useInfoRequestFormList({});

  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('infoRequests:informationRequests')}>
      <PageHeading
        title={t('infoRequests:informationRequests')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={infoRequests || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
