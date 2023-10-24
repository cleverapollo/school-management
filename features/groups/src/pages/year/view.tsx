import { useMemo, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  useNumber,
  Table,
  GridOptions,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  PageHeading,
  ReturnTypeDisplayNames,
  useDisclosure,
  ActionMenu,
  PageContainer,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SmsRecipientType, getPersonProfileLink } from '@tyro/api';
import { MobileIcon } from '@tyro/icons';
import { StudentTableAvatar } from '@tyro/people';
import { useYearGroupById } from '../../api/year-groups';

type MembersReturnTypeFromUseYearGroupsById = NonNullable<
  NonNullable<ReturnType<typeof useYearGroupById>['data']>['students']
>[number];

const getYearGroupColumns = (
  t: TFunction<('common' | 'groups')[], undefined, ('common' | 'groups')[]>,
  displayName: ReturnTypeDisplayName,
  displayNames: ReturnTypeDisplayNames
): GridOptions<MembersReturnTypeFromUseYearGroupsById>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<MembersReturnTypeFromUseYearGroupsById, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    lockVisible: true,
  },
  {
    field: 'classGroup.name',
    headerName: t('common:class'),
    filter: true,
  },
  {
    headerName: t('common:tutor'),
    field: 'tutors',
    valueFormatter: ({ data }) => displayNames(data?.tutors),
  },
];

export default function ViewYearGroupPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'sms']);
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);
  const { displayName, displayNames } = usePreferredNameLayout();
  const [selectedRecipients, setSelectedRecipients] =
    useState<RecipientsForSmsModal>([]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: groupData } = useYearGroupById(
    {
      yearGroupEnrollmentPartyId: [groupIdAsNumber ?? 0],
    },
    !!groupIdAsNumber
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
    },
    // {
    //   label: t('mail:sendMail'),
    //   icon: <SendMailIcon />,
    //   onClick: () => {},
    // },
  ];

  const yearGroupColumns = useMemo(
    () => getYearGroupColumns(t, displayName, displayNames),
    [t, displayName, displayNames]
  );
  const title = t('groups:namedMemberList', {
    groupName: groupData?.name ?? '',
  });

  return (
    <>
      <PageContainer title={title}>
        <PageHeading
          title={title}
          breadcrumbs={{
            links: [
              {
                name: t('groups:yearGroups'),
                href: './..',
              },
              {
                name: groupData?.name ?? '',
              },
            ],
          }}
        />
        <Table
          rowData={groupData?.students ?? []}
          columnDefs={yearGroupColumns}
          getRowId={({ data }) => String(data?.partyId)}
          rowSelection="multiple"
          rightAdornment={
            <Fade in={selectedRecipients.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(students) =>
            setSelectedRecipients(
              students.map(({ partyId, person }) => ({
                id: partyId,
                name: displayName(person),
                type: 'individual',
                avatarUrl: person.avatarUrl,
              }))
            )
          }
        />
      </PageContainer>
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
    </>
  );
}
