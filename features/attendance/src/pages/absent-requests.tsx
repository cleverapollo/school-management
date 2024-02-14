import { Box, Button, Fade } from '@mui/material';
import {
  getPersonProfileLink,
  ParentalAttendanceRequestStatus,
  usePermissions,
} from '@tyro/api';
import { AddIcon } from '@tyro/icons';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  useDebouncedValue,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { StudentTableAvatar } from '@tyro/people';
import { ReturnTypeFromUseAbsentRequests, useAbsentRequests } from '../api';
import { AbsentRequestStatusChip } from '../components/absent-requests/absent-request-status-chip';
import { ApproveAbsentRequestConfirmModal } from '../components/absent-requests/approve-absent-request-confirm-modal';
import { DeclineAbsentRequestConfirmModal } from '../components/absent-requests/decline-absent-request-confirm-modal';
import {
  ViewAbsentRequestModal,
  ViewAbsentRequestModalProps,
} from '../components/absent-requests/view-absent-request-modal';
import { CreateAbsentRequestModal } from '../components/absent-requests/create-absent-request-modal';

dayjs.extend(LocalizedFormat);

type ColumnsDef = NonNullable<
  GridOptions<ReturnTypeFromUseAbsentRequests>['columnDefs']
>;

const getAbsentRequestColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  onClickView: Dispatch<
    SetStateAction<ViewAbsentRequestModalProps['initialAbsentRequestState']>
  >,
  overview: boolean
): ColumnsDef => [
  {
    field: 'classGroup.name',
    headerName: t('common:name'),
    checkboxSelection: !overview ? ({ data }) => Boolean(data) : undefined,
    headerCheckboxSelection: !overview,
    lockVisible: true,
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student?.person}
          isPriorityStudent={!!data?.student?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.student?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
  },
  {
    field: 'classGroup',
    headerName: t('common:class'),
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
  },
  {
    field: 'attendanceCode.name',
    headerName: t('attendance:absentType'),
    filter: true,
    valueGetter: ({ data }) => data?.attendanceCode?.name || '-',
  },
  {
    field: 'createdOn',
    headerName: t('common:created'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LLL'),
  },
  {
    field: 'status',
    headerName: t('common:status'),
    sort: 'desc',
    sortIndex: 0,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsentRequests>) =>
      data ? <AbsentRequestStatusChip status={data.status} /> : null,
  },
  {
    field: 'approvedBy',
    headerName: t('attendance:completedBy'),
    valueGetter: ({ data }) => displayName(data?.approvedBy),
  },
  ...(overview
    ? ([
        {
          field: 'adminNote',
          headerName: t('attendance:feedbackFromSchool'),
          valueGetter: ({ data }) => data?.adminNote || '-',
        },
      ] as ColumnsDef)
    : []),
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
  const { isContact } = usePermissions();
  const { t } = useTranslation(['common', 'attendance']);
  const { data: absentRequests } = useAbsentRequests({});
  const [isCreateAbsentRequest, setIsCreateAbsentRequest] = useState(false);
  const [selectedAbsentRequests, setSelectedAbsentRequests] = useState<
    ReturnTypeFromUseAbsentRequests[]
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
      getAbsentRequestColumns(
        t,
        displayName,
        setViewAbsentRequestInitialState,
        isContact
      ),
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

  useEffect(() => {
    if (
      debouncedViewAbsentRequestInitialState !== undefined &&
      !!absentRequests?.length
    ) {
      setViewAbsentRequestInitialState(
        absentRequests.find(
          ({ id }) => id === debouncedViewAbsentRequestInitialState.id
        )
      );
    }
  }, [absentRequests, debouncedViewAbsentRequestInitialState]);

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
        rightAdornment={
          !isContact && (
            <Fade in={selectedAbsentRequests.length > 0} unmountOnExit>
              <Box>
                <ActionMenu
                  menuItems={[
                    {
                      label: t('attendance:approveRequests'),
                      onClick: onOpenApproveAbsentRequestsModal,
                      disabled: !selectedAbsentRequests.some(
                        ({ status }) =>
                          status === ParentalAttendanceRequestStatus.Pending ||
                          status === ParentalAttendanceRequestStatus.Denied
                      ),
                      disabledTooltip: t(
                        'attendance:youHaveNotSelectedPendingAndDeclined'
                      ),
                    },
                    {
                      label: t('attendance:declineRequests'),
                      onClick: onOpenDeclineAbsentRequestsModal,
                      disabled: !selectedAbsentRequests.some(
                        ({ status }) =>
                          status === ParentalAttendanceRequestStatus.Pending ||
                          status === ParentalAttendanceRequestStatus.Approved
                      ),
                      disabledTooltip: t(
                        'attendance:youHaveNotSelectedPendingAndApproved'
                      ),
                    },
                  ]}
                />
              </Box>
            </Fade>
          )
        }
        onRowSelection={setSelectedAbsentRequests}
      />
      <ViewAbsentRequestModal
        isContact={isContact}
        initialAbsentRequestState={debouncedViewAbsentRequestInitialState}
        onClose={() => setViewAbsentRequestInitialState(undefined)}
      />
      {isContact ? (
        isCreateAbsentRequest && (
          <CreateAbsentRequestModal
            onClose={() => setIsCreateAbsentRequest(false)}
          />
        )
      ) : (
        <>
          <ApproveAbsentRequestConfirmModal
            isOpen={isApproveAbsentRequestsModalOpen}
            onClose={onCloseApproveAbsentRequestsModal}
            absentRequestState={selectedAbsentRequests.filter(
              ({ status }) =>
                status !== ParentalAttendanceRequestStatus.Approved
            )}
          />
          <DeclineAbsentRequestConfirmModal
            isOpen={isDeclineAbsentRequestsModalOpen}
            onClose={onCloseDeclineAbsentRequestsModal}
            absentRequestState={selectedAbsentRequests.filter(
              ({ status }) => status !== ParentalAttendanceRequestStatus.Denied
            )}
          />
        </>
      )}
    </PageContainer>
  );
}
