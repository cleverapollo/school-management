import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  PageContainer,
  PageHeading,
  BulkEditedRows,
  TableAvatar,
  sortStartNumberFirst,
} from '@tyro/core';
import { Button } from '@mui/material';
import { VerticalDotsIcon } from '@tyro/icons';
import {
  ParentalAttendanceRequestStatus,
  ParentalAttendanceRequestType,
  SaveParentalAttendanceRequest,
  usePermissions,
} from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ReturnTypeFromUseAbsentRequests,
  useAbsentRequests,
  useCreateOrUpdateAbsentRequest,
} from '../api';
import {
  EditAbsentRequestModal,
  EditAbsentRequestModalProps,
} from '../components/edit-absent-request-modal';
import {
  ViewAbsentRequestModal,
  ViewAbsentRequestModalProps,
} from '../components/view-absent-request-modal';

const getAbsentRequestColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  isStaffUser: boolean,
  onClickEdit: Dispatch<
    SetStateAction<EditAbsentRequestModalProps['initialAbsentRequestState']>
  >,
  onClickView: Dispatch<
    SetStateAction<ViewAbsentRequestModalProps['absentRequestDetails']>
  >
): GridOptions<ReturnTypeFromUseAbsentRequests>['columnDefs'] => [
  {
    field: 'contactPartyId',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: ({ data }) => Boolean(data) && isStaffUser,
    lockVisible: true,
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <TableAvatar
          name={data?.from ?? ''}
          to={`./${data?.studentPartyId ?? ''}`}
          avatarUrl=""
          AvatarProps={{
            sx: {
              borderRadius: 1,
            },
          }}
        />
      ) : null,
    comparator: sortStartNumberFirst,
  },
  {
    field: 'studentPartyId',
    headerName: t('common:class'),
    editable: true,
  },
  {
    field: 'requestType',
    headerName: t('attendance:absentType'),
    filter: true,
    editable: true,
  },
  {
    field: 'from',
    headerName: t('common:created'),
    editable: true,
    sort: 'asc',
  },
  {
    field: 'status',
    headerName: t('common:status'),
    editable: true,
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
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('attendance:editAbsentRequest'),
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function AbsentRequests() {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: absentRequests } = useAbsentRequests({});

  const { mutateAsync: saveBulkAbsentRequest } =
    useCreateOrUpdateAbsentRequest();
  const { isStaffUser } = usePermissions();

  const [editAbsentRequestInitialState, setEditAbsentRequestInitialState] =
    useState<EditAbsentRequestModalProps['initialAbsentRequestState']>();
  const [viewAbsentRequestInitialState, setViewAbsentRequestInitialState] =
    useState<ViewAbsentRequestModalProps['absentRequestDetails']>();

  const absentRequestColumns = useMemo(
    () =>
      getAbsentRequestColumns(
        t,
        isStaffUser,
        setEditAbsentRequestInitialState,
        setViewAbsentRequestInitialState
      ),
    [t, setEditAbsentRequestInitialState]
  );

  const handleCloseEditAbsentRequestModal = () => {
    setEditAbsentRequestInitialState(undefined);
  };

  const handleCloseViewAbsentRequestModal = () => {
    setViewAbsentRequestInitialState(undefined);
  };

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseAbsentRequests,
      | 'id'
      | 'contactPartyId'
      | 'studentPartyId'
      | 'requestType'
      | 'from'
      | 'status'
      | 'parentNote'
      | 'attendanceCodeId'
      | 'to'
    >
  ) => {
    const dataForEndpoint = Object.keys(
      data
    ).map<SaveParentalAttendanceRequest>((id) => {
      const currentData = absentRequests?.find(
        (item) => item?.id === Number(id)
      );
      return {
        id: Number(id),
        contactPartyId:
          data[id].contactPartyId?.newValue ??
          currentData?.contactPartyId ??
          -1,
        studentPartyId:
          data[id].studentPartyId?.newValue ??
          currentData?.studentPartyId ??
          -1,
        requestType:
          data[id].requestType?.newValue ??
          currentData?.requestType ??
          ParentalAttendanceRequestType.MultiDay,
        from: data[id].from?.newValue ?? currentData?.from ?? '',
        status:
          data[id].status?.newValue ??
          currentData?.status ??
          ParentalAttendanceRequestStatus.Approved,
        parentNote:
          data[id].parentNote?.newValue ?? currentData?.parentNote ?? '',
        attendanceCodeId:
          data[id].attendanceCodeId?.newValue ??
          currentData?.attendanceCodeId ??
          -1,
        to: data[id].to?.newValue ?? currentData?.to ?? '',
      };
    });
    return saveBulkAbsentRequest(dataForEndpoint);
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
        onBulkSave={handleBulkSave}
      />
      <EditAbsentRequestModal
        initialAbsentRequestState={editAbsentRequestInitialState}
        onClose={handleCloseEditAbsentRequestModal}
      />
      <ViewAbsentRequestModal
        absentRequestDetails={viewAbsentRequestInitialState}
        onClose={handleCloseViewAbsentRequestModal}
      />
    </PageContainer>
  );
}
