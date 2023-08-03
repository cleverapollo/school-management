import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  PageContainer,
  PageHeading,
  sortStartNumberFirst,
  TablePersonAvatar,
  useDisclosure,
} from '@tyro/core';
import { Box, Button, Fade, Typography } from '@mui/material';
import { SaveParentalAttendanceRequest } from '@tyro/api';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ReturnTypeFromUseAbsentRequests, useAbsentRequests } from '../api';
import {
  ViewAbsentRequestModal,
  ViewAbsentRequestModalProps,
} from '../components/view-absent-request-modal';
import { ApproveAbsentRequestsConfirmModal } from '../components/approve-absent-requests-confirm-modal';
import { DeclineAbsentRequestsConfirmModal } from '../components/decline-absent-requests-confirm-modal';

const getAbsentRequestColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  onClickView: Dispatch<
    SetStateAction<ViewAbsentRequestModalProps['initialAbsentRequestState']>
  >
): GridOptions<ReturnTypeFromUseAbsentRequests>['columnDefs'] => [
  {
    field: 'student',
    headerName: t('common:name'),
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <TablePersonAvatar
          person={data?.student}
          to={`./${data?.studentPartyId ?? ''}`}
        />
      ) : null,
    comparator: sortStartNumberFirst,
  },
  {
    field: 'classGroup',
    headerName: t('common:class'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? <Typography>{data?.classGroup?.name ?? '-'}</Typography> : null,
  },
  {
    field: 'attendanceCode.name',
    headerName: t('attendance:absentType'),
    filter: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <Typography>{data?.attendanceCode?.name ?? '-'}</Typography>
      ) : null,
  },
  {
    field: 'createdOn',
    headerName: t('common:created'),
    sort: 'asc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <Typography>{dayjs(data?.createdOn).format('D MMMM YYYY')}</Typography>
      ) : null,
  },
  {
    field: 'status',
    headerName: t('common:status'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <Typography sx={{ textTransform: 'lowercase' }}>
          {data?.status}
        </Typography>
      ) : null,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data && <Button onClick={() => onClickView(data)}>View</Button>,
  },
];

export default function AbsentRequests() {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: absentRequests } = useAbsentRequests({});

  const [viewAbsentRequestInitialState, setViewAbsentRequestInitialState] =
    useState<ViewAbsentRequestModalProps['initialAbsentRequestState']>();
  const [selectedAbsentRequests, setSelectedAbsentRequests] = useState<
    SaveParentalAttendanceRequest[]
  >([]);

  const absentRequestColumns = useMemo(
    () => getAbsentRequestColumns(t, setViewAbsentRequestInitialState),
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

  const handleCloseViewAbsentRequestModal = () => {
    setViewAbsentRequestInitialState(undefined);
  };

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
                  },
                  {
                    label: t('attendance:declineRequests'),
                    onClick: onOpenDeclineAbsentRequestsModal,
                  },
                ]}
              />
            </Box>
          </Fade>
        }
        onRowSelection={(newSelectedAbsentRequests) =>
          setSelectedAbsentRequests(
            newSelectedAbsentRequests.map((absentRequest) => ({
              adminNote: absentRequest.adminNote,
              attendanceCodeId: absentRequest.attendanceCodeId,
              from: absentRequest.from,
              id: absentRequest.id,
              parentNote: absentRequest.parentNote,
              requestType: absentRequest.requestType,
              status: absentRequest.status,
              studentPartyId: absentRequest.studentPartyId,
              to: absentRequest.to,
            }))
          )
        }
      />
      <ViewAbsentRequestModal
        initialAbsentRequestState={viewAbsentRequestInitialState}
        onClose={handleCloseViewAbsentRequestModal}
      />
      <ApproveAbsentRequestsConfirmModal
        isOpen={isApproveAbsentRequestsModalOpen}
        onClose={onCloseApproveAbsentRequestsModal}
        absentRequests={selectedAbsentRequests}
      />
      <DeclineAbsentRequestsConfirmModal
        isOpen={isDeclineAbsentRequestsModalOpen}
        onClose={onCloseDeclineAbsentRequestsModal}
        absentRequests={selectedAbsentRequests}
      />
    </PageContainer>
  );
}
