import { Box, Container, Fade, Typography } from '@mui/material';
import { usePermissions } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  ActionMenuProps,
  GridOptions,
  ICellRendererParams,
  Page,
  RouterLink,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import {
  ArchiveIcon,
  MobileIcon,
  SendMailIcon,
  UnarchiveIcon,
} from '@tyro/icons';
import { useEnrolmentGroups } from '../../api/general-groups';

type ReturnTypeFromUseEnrolmentGroups = NonNullable<
  ReturnType<typeof useEnrolmentGroups>['data']
>[number];

const getEnrolmentGroupColumns = (
  t: TFunction<
    ('common' | 'groups' | 'people' | 'mail')[],
    undefined,
    ('common' | 'groups' | 'people' | 'mail')[]
  >,
  isStaffUser: boolean,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseEnrolmentGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: ({ data }) => Boolean(data) && isStaffUser,
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseEnrolmentGroups>) => (
      <RouterLink sx={{ fontWeight: 600 }} to={`${data?.partyId ?? ''}`}>
        {data?.name}
      </RouterLink>
    ),
    sort: 'asc',
  },
  {
    headerName: t('common:members'),
    filter: true,
    valueGetter: ({ data }) =>
      (data?.studentMembers?.memberCount ?? 0) +
      (data?.staffMembers?.memberCount ?? 0) +
      (data?.contactMembers?.memberCount ?? 0),
  },
  {
    headerName: t('common:year'),
    field: 'year',
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.yearGroups?.map((year) => year?.name).join(', '),
  },
  {
    headerName: t('common:tutor'),
    field: 'tutor',
    valueGetter: ({ data }) => displayNames(data?.tutors),
  },
  {
    headerName: t('common:yearhead'),
    field: 'yearhead',
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.yearGroupLeads),
  },
  {
    headerName: t('common:programme'),
    field: 'programme',
    valueGetter: ({ data }) =>
      data?.programmeStages
        ?.map((programmeStage) => programmeStage?.programme?.name)
        ?.filter(Boolean)
        .join(', '),
    enableRowGroup: true,
  },
];

export default function EnrolmentGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseEnrolmentGroups[]
  >([]);
  const { displayNames } = usePreferredNameLayout();
  const { isStaffUser } = usePermissions();
  const { data: enrolmentGroupData } = useEnrolmentGroups();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;

  const enrolmentGroupColumns = useMemo(
    () => getEnrolmentGroupColumns(t, isStaffUser, displayNames),
    [t, isStaffUser]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
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

    // TODO: add flag to check status
    const isThereAtLeastOneUnarchived = true;

    const archiveActions = [
      isThereAtLeastOneUnarchived
        ? {
            label: t('common:actions.archive'),
            icon: <ArchiveIcon />,
            // TODO: add action logic
            onClick: () => {},
          }
        : {
            label: t('common:actions.unarchive'),
            icon: <UnarchiveIcon />,
            // TODO: add action logic
            onClick: () => {},
          },
    ];

    return [commonActions, archiveActions];
  }, []);

  return (
    <Page title={t('groups:enrolmentGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:enrolmentGroups')}
        </Typography>
        <Table
          rowData={enrolmentGroupData ?? []}
          columnDefs={enrolmentGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
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
          onRowSelection={setSelectedGroups}
        />
      </Container>
    </Page>
  );
}
