import { Box, Button } from '@mui/material';
import { usePermissions } from '@tyro/api';
import { AddIcon } from '@tyro/icons';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  useDebouncedValue,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useMemo, useState } from 'react';
import { AbsentRequestStatusChip } from '../components/absent-requests/absent-request-status-chip';
import { ViewAbsentRequestModalProps } from '../components/absent-requests/view-absent-request-modal';
import {
  ReturnTypeFromUseSessionAttendanceList,
  useSessionAttendanceList,
} from '../api/session-attendance-table';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<
  ReturnTypeFromUseSessionAttendanceList[number]
>['columnDefs'] => [
  {
    field: 'classGroup.name',
    headerName: t('common:name'),
    checkboxSelection: true,
    headerCheckboxSelection: true,
    lockVisible: true,
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSessionAttendanceList>) =>
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
];

export default function AbsentRequests() {
  const { isContact } = usePermissions();
  const { t } = useTranslation(['common', 'attendance']);
  // const { data: absentRequests } = useSessionAttendanceList({
  //   attendanceCodeIds: [1],
  //   from: dayjs().format('YYYY-MM-DD'),
  //   to: dayjs().format('YYYY-MM-DD'),
  // });
  const { data: absentRequests } = useSessionAttendanceList({});
  const [isCreateAbsentRequest, setIsCreateAbsentRequest] = useState(false);
  const [selectedAbsentRequests, setSelectedAbsentRequests] = useState<
    ReturnTypeFromUseSessionAttendanceList[]
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
    () => getColumns(t, displayName),
    [t, setViewAbsentRequestInitialState, isContact]
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
        rightAdornment={
          isContact && (
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                onClick={() => setIsCreateAbsentRequest(true)}
                startIcon={<AddIcon />}
              >
                {t('attendance:createAbsentRequest')}
              </Button>
            </Box>
          )
        }
      />
      <Table
        rowData={absentRequests ?? []}
        columnDefs={absentRequestColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={setSelectedAbsentRequests}
      />
    </PageContainer>
  );
}
