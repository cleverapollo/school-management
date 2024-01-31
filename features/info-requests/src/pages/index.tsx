import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  RouterLink,
  Table,
  TableBooleanValue,
  TablePersonAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Stack, Tooltip } from '@mui/material';
import {
  ReturnTypeFromUseInfoRequestFormList,
  useInfoRequestFormList,
} from '../api/form-list';
import { InfoRequestStatusChip } from '../components/status-chip';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<
    ('common' | 'infoRequests')[],
    undefined,
    ('common' | 'infoRequests')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseInfoRequestFormList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseInfoRequestFormList>) => {
      if (!data) return null;

      const { name, provider, forPartyId, objectId } = data.id;
      return (
        <RouterLink
          to={`./view?name=${name}&provider=${provider}&forPartyId=${
            forPartyId ?? 0
          }&objectId=${objectId ?? 0}`}
        >
          {data.name}
        </RouterLink>
      );
    },
  },
  {
    field: 'forPerson',
    headerName: t('common:for'),
    valueGetter: ({ data }) => displayName(data?.forPerson),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseInfoRequestFormList>) => {
      if (!data) return null;
      const { forPerson } = data;

      return <TablePersonAvatar person={forPerson} />;
    },
  },
  {
    field: 'dueDate',
    headerName: t('common:dueDate'),
    valueGetter: ({ data }) => dayjs(data?.dueDate).format('lll'),
  },
  {
    field: 'status',
    headerName: t('common:status'),
    valueGetter: ({ data }) => {
      if (!data) return null;

      return t(`infoRequests:status.${data.status}`);
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseInfoRequestFormList>) => {
      if (!data) return null;

      return (
        <Tooltip
          title={
            data.completionDate
              ? t('common:completedOnDate', {
                  date: dayjs(data.completionDate).format('lll'),
                })
              : undefined
          }
        >
          <Stack justifyContent="center">
            <InfoRequestStatusChip status={data.status} />
          </Stack>
        </Tooltip>
      );
    },
  },
];

export default function InfoRequestFormList() {
  const { t } = useTranslation(['common', 'infoRequests']);
  const { displayName } = usePreferredNameLayout();

  const { data: infoRequests } = useInfoRequestFormList({});

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

  return (
    <PageContainer title={t('infoRequests:informationRequests')}>
      <PageHeading
        title={t('infoRequests:informationRequests')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={infoRequests || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => JSON.stringify(data?.id)}
      />
    </PageContainer>
  );
}
