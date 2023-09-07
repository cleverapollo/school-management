import { Box, Button } from '@mui/material';
import { AttendanceCodeType, usePermissions } from '@tyro/api';
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
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useMemo, useState } from 'react';
import { AbsentRequestStatusChip } from '../components/absent-requests/absent-request-status-chip';
import { ViewAbsentRequestModalProps } from '../components/absent-requests/view-absent-request-modal';
import {
  ReturnTypeFromUseSessionAttendanceList,
  useSessionAttendanceList,
} from '../api/session-attendance-table';
import { RolebookToolbar } from '../components/role-book/toolbar';
import { AttendanceListToolbar } from '../components/attendance-list-toolbar';
import { ReturnTypeFromUseAttendanceCodes, useAttendanceCodes } from '../api';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseSessionAttendanceList>['columnDefs'] => [
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
    field: 'date',
    headerName: t('common:date'),
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
    valueGetter: ({ data }) => dayjs(data?.date).format('LL'),
  },
  {
    field: 'note',
    headerName: t('common:note'),
  },
];

export default function AbsentRequests() {
  const { isContact } = usePermissions();
  const { t } = useTranslation(['common', 'attendance']);

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs(),
  ]);

  const { data: allAttendanceCodes } = useAttendanceCodes({});

  const defaultCodes = useMemo(
    () =>
      allAttendanceCodes?.filter(
        (code) => code.sessionCodeType === AttendanceCodeType.UnexplainedAbsence
      ) ?? [],
    [allAttendanceCodes]
  );

  const [codeFilter, setCodeFilter] = useState<
    ReturnTypeFromUseAttendanceCodes[]
  >([]);

  useEffect(() => {
    setCodeFilter(defaultCodes);
  }, [allAttendanceCodes]);
  const [from, to] = dateRange;
  const fromDate = from.format('YYYY-MM-DD');
  const toDate = to.format('YYYY-MM-DD');

  const codeFilterIds = useMemo(
    () => codeFilter.map(({ id }) => id),
    [codeFilter]
  );
  const { data: absentRequests } = useSessionAttendanceList({
    attendanceCodeIds: codeFilterIds,
    from: fromDate,
    to: toDate,
  });
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
        toolbar={
          <AttendanceListToolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            codeFilter={codeFilter}
            setCodeFilter={setCodeFilter}
          />
        }
      />
    </PageContainer>
  );
}
