import { useMemo, useState } from 'react';
import { Box, Fade, Grid, Stack, Typography } from '@mui/material';
import {
  SmsRecipientType,
  usePermissions,
  UseQueryReturnType,
} from '@tyro/api';
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

import { MobileIcon, UserGroupTwoIcon } from '@tyro/icons';

import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useClassGroupById } from '../../api/class-groups';
import { BlocksChips } from '../../components/class-group/blocks-chips';

type ReturnTypeFromUseSubjectGroupById = UseQueryReturnType<
  typeof useClassGroupById
>['relatedSubjectGroups'][number];

const getSubjectGroupsColumns = (
  t: TFunction<('common' | 'groups')[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'name',
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
    colId: 'year',
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
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
  {
    colId: 'studentGroupType',
    headerName: t('groups:groupType'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.studentMembershipType?.type
        ? t(
            `groups:subjectGroupStudentMembershipType.${data.studentMembershipType.type}`
          )
        : t('groups:subjectGroupStudentMembershipType.UNKNOWN'),
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);
  const { isTyroUser } = usePermissions();

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
      {subjectGroupData && isTyroUser && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <UserGroupTwoIcon sx={{ color: 'text.secondary' }} />
          <Typography variant="body1" color="text.primary">
            {t('common:blocks')}
          </Typography>
          <Grid container direction="row" gap={1} alignItems="center">
            {groupIdAsNumber && (
              <BlocksChips
                blocks={subjectGroupData.blocks}
                classGroupId={groupIdAsNumber}
              />
            )}
          </Grid>
        </Stack>
      )}
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
            type: SmsRecipientType.SubjectGroupContact,
          },
          {
            label: t('sms:yearHeadsOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
    </>
  );
}
