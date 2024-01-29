import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Table,
  TableAvatar,
  TableStudyLevelChip,
  getNumber,
  useDisclosure,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  UseQueryReturnType,
  SmsRecipientType,
  PermissionUtils,
  RecipientSearchType,
} from '@tyro/api';
import { MobileIcon, PrinterIcon, SendMailIcon } from '@tyro/icons';
import { Box, Fade } from '@mui/material';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { printGroupMembers } from '@tyro/groups';
import { useMailSettings } from '@tyro/mail';
import { useStaffSubjectGroups } from '../../../api/staff/subject-groups';

type ReturnTypeFromUseStaffSubjectGroups = UseQueryReturnType<
  typeof useStaffSubjectGroups
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>
): GridOptions<ReturnTypeFromUseStaffSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffSubjectGroups>) => {
      if (!data) return null;

      const [subject] = data.subjects || [];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};

      return (
        <TableAvatar
          name={data.name}
          to={`/groups/subject/${data.partyId}`}
          avatarUrl={data.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffSubjectGroups>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
  },
];

export default function StaffProfileClassesPage() {
  const { t } = useTranslation(['common', 'people', 'sms', 'mail', 'groups']);

  const { id } = useParams();
  const staffId = getNumber(id);

  const { sendMailToParties } = useMailSettings();
  const { data: subjectGroupsData } = useStaffSubjectGroups(
    {
      partyIds: [staffId ?? 0],
    },
    undefined
  );

  const staffColumns = useMemo(() => getSubjectGroupsColumns(t), [t]);

  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const actionMenuItems = useMemo(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
      },
      {
        label: t('mail:sendMail'),
        icon: <SendMailIcon />,
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission(
            'api:communications:read:search_recipients'
          ),
        onClick: () => {
          sendMailToParties(
            selectedGroups.map((group) => group.id),
            [
              {
                label: t('mail:contactsOfStudentsInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupContact,
              },
              {
                label: t('mail:teachersOfGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupStaff,
              },
              {
                label: t('mail:studentInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupStudent,
              },
            ]
          );
        },
      },
      {
        label: t('groups:printGroupMembers'),
        icon: <PrinterIcon />,
        onClick: () => printGroupMembers(selectedGroups),
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission(
            'ps:1:printing_and_exporting:print_group_members'
          ),
      },
    ],
    [selectedGroups, onOpenSendSms, sendMailToParties, t]
  );

  return (
    <>
      <Table
        rowData={subjectGroupsData || []}
        columnDefs={staffColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.partyId)}
        rightAdornment={
          <Fade in={selectedGroups.length > 0} unmountOnExit>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onRowSelection={(groups) =>
          setSelectedGroups(
            groups.map(({ partyId, name, avatarUrl, subjects }) => {
              const [subject] = subjects || [];
              return {
                id: partyId,
                name,
                type: 'group',
                avatarUrl,
                avatarColor: subject?.colour,
              };
            })
          )
        }
      />
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudentMembers', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupContact,
          },
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
    </>
  );
}
