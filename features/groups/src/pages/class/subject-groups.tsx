import { useMemo, useState } from 'react';
import { Box, Fade, Grid, Stack, Typography } from '@mui/material';
import {
  RecipientSearchType,
  SmsRecipientType,
  usePermissions,
  UseQueryReturnType,
  SubjectGroupStudentMembershipTypeEnum,
  PermissionUtils,
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

import { MobileIcon, SendMailIcon, UserGroupTwoIcon } from '@tyro/icons';

import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { useClassGroupById } from '../../api/class-groups';
import { BlocksChips } from '../../components/class-group/blocks-chips';
import { CoreSubjectGroupChips } from '../../components/class-group/core-subject-group-chips';

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
  const { sendMailToParties } = useMailSettings();

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
    ],
    [t, selectedGroups, sendMailToParties, onOpenSendSms]
  );

  return (
    <>
      {subjectGroupData && isTyroUser && (
        <>
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

          <Stack direction="row" alignItems="center" spacing={1}>
            <UserGroupTwoIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body1" color="text.primary">
              {t('common:core')}
            </Typography>
            <Grid container direction="row" gap={1} alignItems="center">
              {groupIdAsNumber && (
                <CoreSubjectGroupChips
                  subjectGroups={subjectGroupData.relatedSubjectGroups.filter(
                    ({ studentMembershipType }) =>
                      studentMembershipType?.type ===
                      SubjectGroupStudentMembershipTypeEnum.Core
                  )}
                  classGroupId={groupIdAsNumber}
                />
              )}
            </Grid>
          </Stack>
        </>
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
