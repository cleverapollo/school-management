import { Box, Chip, Fade } from '@mui/material';
import {
  AttendanceCodeType,
  getPersonProfileLink,
  PermissionUtils,
  RecipientSearchType,
  SmsRecipientType,
} from '@tyro/api';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useMemo, useState } from 'react';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { StudentTableAvatar } from '@tyro/people';
import { useMailSettings } from '@tyro/mail';
import {
  ReturnTypeFromUseSessionAttendanceList,
  useSessionAttendanceList,
} from '../api/session-attendance-table';
import { AttendanceListToolbar } from '../components/attendance-list-toolbar';
import { ReturnTypeFromUseAttendanceCodes, useAttendanceCodes } from '../api';

dayjs.extend(LocalizedFormat);
const bellColors = { AM: 'blue', PM: 'default' };
// @ts-ignore
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
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSessionAttendanceList>) =>
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
    field: 'bellTime',
    headerName: t('attendance:bellTime'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSessionAttendanceList>) => {
      const color = data?.bellTime?.name === 'AM' ? 'blue' : 'default';
      return (
        data && (
          <Chip
            size="small"
            color={color}
            variant="soft"
            label={data?.bellTime?.name}
          />
        )
      );
    },
  },
  {
    field: 'note',
    headerName: t('attendance:note'),
  },
];

export default function AbsentRequests() {
  const { t } = useTranslation([
    'common',
    'attendance',
    'people',
    'sms',
    'mail',
  ]);

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs(),
  ]);

  const { data: allAttendanceCodes } = useAttendanceCodes({});
  const { sendMailToParties } = useMailSettings();

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
  const [selectedRecipients, setSelectedRecipients] =
    useState<RecipientsForSmsModal>([]);

  const { displayName } = usePreferredNameLayout();

  const absentRequestColumns = useMemo(() => getColumns(t, displayName), [t]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
      hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
        isStaffUserWithPermission('ps:1:communications:send_sms'),
    },
    {
      label: t('mail:sendMail'),
      icon: <SendMailIcon />,
      hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
        isStaffUserWithPermission('api:communications:read:search_recipients'),
      onClick: () => {
        sendMailToParties(
          selectedRecipients.map(({ id }) => id),
          [
            {
              label: t('mail:contactsOfStudent', {
                count: selectedRecipients.length,
              }),
              type: RecipientSearchType.StudentContacts,
            },
          ]
        );
      },
    },
  ];
  return (
    <PageContainer title={t('attendance:unexplainedAbsences')}>
      <PageHeading
        title={t('attendance:unexplainedAbsences')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Fade in={selectedRecipients.length > 0} unmountOnExit>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
      />
      <Table
        rowData={absentRequests ?? []}
        columnDefs={absentRequestColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={(students) =>
          setSelectedRecipients(
            students.map(({ student: { person } }) => ({
              id: person.partyId,
              name: displayName(person),
              type: 'individual',
              avatarUrl: person.avatarUrl,
            }))
          )
        }
        toolbar={
          <AttendanceListToolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            codeFilter={codeFilter}
            setCodeFilter={setCodeFilter}
          />
        }
        statusBar={{
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
          ],
        }}
      />
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedRecipients}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudent', {
              count: selectedRecipients?.length ?? 0,
            }),
            type: SmsRecipientType.Student,
          },
        ]}
      />
    </PageContainer>
  );
}
