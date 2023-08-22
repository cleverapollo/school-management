import { Button } from '@mui/material';
import { useUser } from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  useDebouncedValue,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { ReturnTypeFromUseAbsentRequests, useAbsentRequests } from '../api';
import {
  ViewAbsentRequestModal,
  ViewAbsentRequestModalProps,
} from '../components/absent-requests-overview/view-absent-request-overview-modal';
import { AbsentRequestStatusChip } from '../components/absent-requests/absent-request-status-chip';

dayjs.extend(LocalizedFormat);

const getAbsentRequestsOverviewColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  onClickView: Dispatch<
    SetStateAction<ViewAbsentRequestModalProps['initialAbsentRequestState']>
  >
): GridOptions<ReturnTypeFromUseAbsentRequests>['columnDefs'] => [
  {
    field: 'classGroup.name',
    headerName: t('common:name'),
    lockVisible: true,
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <TablePersonAvatar
          person={data?.student}
          to={`/people/students/${data?.studentPartyId ?? ''}/overview`}
        />
      ) : null,
  },
  {
    field: 'classGroup',
    headerName: t('common:class'),
    valueGetter: ({ data }) => data?.classGroup?.name ?? '-',
  },
  {
    field: 'attendanceCode.name',
    headerName: t('attendance:absentType'),
    filter: true,
    valueGetter: ({ data }) => data?.attendanceCode?.name ?? '-',
  },
  {
    field: 'createdOn',
    headerName: t('common:created'),
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
  },
  {
    field: 'status',
    headerName: t('common:status'),
    sort: 'desc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? <AbsentRequestStatusChip status={data.status} /> : null,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data && (
        <Button onClick={() => onClickView(data)}>
          {t('common:actions.view')}
        </Button>
      ),
  },
];

export default function AbsentRequestsOverview() {
  const { user } = useUser();
  const { t } = useTranslation(['common', 'attendance']);
  const { data: absentRequests } = useAbsentRequests({
    contactPartyId: user?.activeProfileId,
  });

  const {
    setValue: setViewAbsentRequestInitialState,
    debouncedValue: debouncedViewAbsentRequestInitialState,
  } = useDebouncedValue<
    ViewAbsentRequestModalProps['initialAbsentRequestState']
  >({
    defaultValue: undefined,
  });

  const { displayName } = usePreferredNameLayout();

  const absentRequestColumns = useMemo(
    () =>
      getAbsentRequestsOverviewColumns(
        t,
        displayName,
        setViewAbsentRequestInitialState
      ),
    [t, setViewAbsentRequestInitialState]
  );

  return (
    <PageContainer title={t('attendance:absentRequestOverview')}>
      <PageHeading
        title={t('attendance:absentRequestOverview')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={absentRequests ?? []}
        columnDefs={absentRequestColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      <ViewAbsentRequestModal
        initialAbsentRequestState={debouncedViewAbsentRequestInitialState}
        onClose={() => setViewAbsentRequestInitialState(undefined)}
      />
    </PageContainer>
  );
}
