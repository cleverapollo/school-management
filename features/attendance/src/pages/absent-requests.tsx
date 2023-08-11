import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  PageContainer,
  PageHeading,
  TablePersonAvatar,
  useDisclosure,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  useDebouncedValue,
} from '@tyro/core';
import { Box, Button, Fade } from '@mui/material';
import {
  ParentalAttendanceRequestStatus,
  SaveParentalAttendanceRequest,
} from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ReturnTypeFromUseAbsentRequests, useAbsentRequests } from '../api';
import {
  ViewAbsentRequestModal,
  ViewAbsentRequestModalProps,
} from '../components/absent-requests/view-absent-request-modal';
import { ApproveAbsentRequestConfirmModal } from '../components/absent-requests/approve-absent-request-confirm-modal';
import { DeclineAbsentRequestConfirmModal } from '../components/absent-requests/decline-absent-request-confirm-modal';
import { AbsentRequestStatusChip } from '../components/absent-requests/absent-request-status-chip';

dayjs.extend(LocalizedFormat);

const getAbsentRequestColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  onClickView: Dispatch<
    SetStateAction<ViewAbsentRequestModalProps['initialAbsentRequestState']>
  >
): GridOptions<ReturnTypeFromUseAbsentRequests>['columnDefs'] => [
  {
    field: 'classGroup.name',
    headerName: t('common:name'),
    checkboxSelection: ({ data }) => Boolean(data),
    headerCheckboxSelection: true,
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

export default function AbsentRequests() {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: absentRequests } = useAbsentRequests({});

  const [selectedAbsentRequests, setSelectedAbsentRequests] = useState<
    SaveParentalAttendanceRequest[]
  >([]);
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
      getAbsentRequestColumns(t, displayName, setViewAbsentRequestInitialState),
    [t, setViewAbsentRequestInitialState]
  );

  const {
    isOpen: isApproveAbsentRequestsModalOpen,
    onOpen: onOpenApproveAbsentRequestsModal,
    onClose: onCloseApproveAbsentRequestsModal,
  } = useDisclosure();

  const {
    isOpen: isDeclineAbsentRequestsModalOpen,
    onOpen: onOpenDeclineAbsentRequestsModal,
    onClose: onCloseDeclineAbsentRequestsModal,
  } = useDisclosure();

  return (
    <PageContainer title={t('attendance:absentRequests')}>
      <PageHeading
        title={t('attendance:absentRequests')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={absentRequests ?? []}
        columnDefs={absentRequestColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        rightAdornment={
          <Fade in={selectedAbsentRequests.length > 0} unmountOnExit>
            <Box>
              <ActionMenu
                menuItems={[
                  {
                    label: t('attendance:approveRequests'),
                    onClick: onOpenApproveAbsentRequestsModal,
                    disabled: !!selectedAbsentRequests.find(
                      ({ status }) =>
                        status === ParentalAttendanceRequestStatus.Approved
                    ),
                    disabledTooltip: selectedAbsentRequests.find(
                      ({ status }) =>
                        status === ParentalAttendanceRequestStatus.Pending ||
                        status === ParentalAttendanceRequestStatus.Denied
                    )
                      ? ''
                      : 'You have not selected any "Pending" or "Declined" requests',
                  },
                  {
                    label: t('attendance:declineRequests'),
                    onClick: onOpenDeclineAbsentRequestsModal,
                    disabled: !!selectedAbsentRequests.find(
                      ({ status }) =>
                        status === ParentalAttendanceRequestStatus.Denied
                    ),
                    disabledTooltip: selectedAbsentRequests.find(
                      ({ status }) =>
                        status === ParentalAttendanceRequestStatus.Pending ||
                        status === ParentalAttendanceRequestStatus.Approved
                    )
                      ? ''
                      : 'You have not selected any "Pending" or "Approved" requests',
                  },
                ]}
              />
            </Box>
          </Fade>
        }
        onRowSelection={setSelectedAbsentRequests}
      />
      <ViewAbsentRequestModal
        initialAbsentRequestState={debouncedViewAbsentRequestInitialState}
        onClose={() => setViewAbsentRequestInitialState(undefined)}
      />
      <ApproveAbsentRequestConfirmModal
        isOpen={isApproveAbsentRequestsModalOpen}
        onClose={onCloseApproveAbsentRequestsModal}
        absentRequestState={selectedAbsentRequests}
      />
      <DeclineAbsentRequestConfirmModal
        isOpen={isDeclineAbsentRequestsModalOpen}
        onClose={onCloseDeclineAbsentRequestsModal}
        absentRequestState={selectedAbsentRequests}
      />
    </PageContainer>
  );
}
