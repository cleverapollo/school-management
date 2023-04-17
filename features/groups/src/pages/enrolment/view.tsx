import { useMemo, useState } from 'react';
import { Box, Container, Fade } from '@mui/material';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  useNumber,
  Page,
  Table,
  GridOptions,
  ActionMenu,
  TableAvatar,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  PageHeading,
} from '@tyro/core';
import { useEnrolmentGroupById } from '../../api/general-groups';
import { getPersonProfileLink } from '../../utils/get-person-profile-link';

type MembersReturnTypeFromUseEnrolmentGroupById = NonNullable<
  ReturnType<typeof useEnrolmentGroupById>['data']
>['members'][number];

const getEnrolmentGroupColumns = (
  t: TFunction<('common' | 'groups')[], undefined, ('common' | 'groups')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<MembersReturnTypeFromUseEnrolmentGroupById>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.person ?? undefined),
    cellRenderer: ({
      data,
    }: ICellRendererParams<
      MembersReturnTypeFromUseEnrolmentGroupById,
      any
    >) => (
      <TableAvatar
        person={data?.person ?? undefined}
        to={getPersonProfileLink(data?.person ?? undefined)}
      />
    ),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
];

export default function ViewEnrolmentGroupPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);
  const { displayName } = usePreferredNameLayout();
  const [selectedMembers, setSelectedMembers] = useState<
    MembersReturnTypeFromUseEnrolmentGroupById[]
  >([]);

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      // TODO: add action logic
      onClick: () => {},
    },
    {
      label: t('mail:sendMail'),
      icon: <SendMailIcon />,
      onClick: () => {},
    },
  ];

  const { data: groupData } = useEnrolmentGroupById(groupIdAsNumber);

  const enrolmentGroupColumns = useMemo(
    () => getEnrolmentGroupColumns(t, displayName),
    [t, displayName]
  );
  const title = t('groups:namedMemberList', {
    groupName: groupData?.name ?? '',
  });
  const showActionMenu = selectedMembers.length > 0;

  return (
    <Page title={title}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 3,
        }}
      >
        <PageHeading
          title={title}
          breadcrumbs={{
            links: [
              {
                name: t('groups:enrolmentGroups'),
                href: './..',
              },
              {
                name: groupData?.name ?? '',
              },
            ],
          }}
        />
        <Table
          rowData={groupData?.members ?? []}
          columnDefs={enrolmentGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.person?.partyId)}
          rightAdornment={
            <Fade in={showActionMenu} unmountOnExit>
              <Box>
                <ActionMenu
                  menuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                  }}
                  menuItems={actionMenuItems}
                />
              </Box>
            </Fade>
          }
          onRowSelection={setSelectedMembers}
        />
      </Container>
    </Page>
  );
}
