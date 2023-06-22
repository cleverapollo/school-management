import { useMemo, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { SmsRecipientType } from '@tyro/api';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  ActionMenu,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableAvatar,
  useDisclosure,
  useNumber,
  sortStartNumberFirst,
} from '@tyro/core';

import { MobileIcon } from '@tyro/icons';

import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useClassGroupById } from '../../api/class-groups';

type ReturnTypeFromUseSubjectGroupById = NonNullable<
  NonNullable<
    ReturnType<typeof useClassGroupById>['data']
  >['relatedSubjectGroups']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'relatedSubjectGroups',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,

    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroupById>) => {
      if (!data) return null;
      const subject = data?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`/groups/subject/${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    comparator: sortStartNumberFirst,
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    valueGetter: ({ data }) => data?.subjects?.[0]?.name,
    enableRowGroup: true,
  },
  {
    headerName: t('common:members'),
    valueGetter: ({ data }) =>
      data ? data?.studentMembers?.memberCount ?? 0 : null,
  },
  {
    headerName: t('common:year'),
    field: 'year',
    enableRowGroup: true,
    valueGetter: ({ data }) => data?.programmeStages[0]?.name,
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueGetter: ({ data }) => data?.irePP?.level,
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => {
      const person = [
        {
          firstName: data?.staff?.[0]?.firstName,
          lastName: data?.staff?.[0]?.lastName,
        },
      ];
      return displayNames(person);
    },
    enableRowGroup: true,
  },
  {
    field: 'studentGroupType',
    headerName: 'Group type',
    enableRowGroup: true,
    valueGetter: ({ data }) => data && data?.studentMembershipType?.type,
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  const { data: subjectGroupData } = useClassGroupById(groupIdAsNumber);

  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
    },
  ];

  return (
    <>
      <Table
        rowData={subjectGroupData?.relatedSubjectGroups ?? []}
        columnDefs={studentColumns}
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
              const subject = subjects?.[0];
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
            type: SmsRecipientType.YearGroupContact,
          },
          {
            label: t('sms:yearHeadsOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.YearGroupStaff,
          },
        ]}
      />
    </>
  );
}
