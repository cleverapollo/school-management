import { Box, Button, Container, Fade, Typography } from '@mui/material';
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
  isStaffUser: boolean
): GridOptions<ReturnTypeFromUseEnrolmentGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: isStaffUser,
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseEnrolmentGroups>) => (
      <RouterLink sx={{ fontWeight: 600 }} to={`${data?.partyId ?? ''}`}>
        {data?.name}
      </RouterLink>
    ),
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
  },
  {
    headerName: t('common:tutor'),
    field: 'tutor',
  },
  {
    headerName: t('common:yearhead'),
    field: 'yearhead',
  },
  {
    headerName: t('common:programme'),
    field: 'programme',
    valueGetter: ({ data }) =>
      data?.programmeStages
        ?.reduce<string[]>((acc, programmeStage) => {
          if (programmeStage?.programme?.name) {
            acc.push(programmeStage.programme.name);
          }
          return acc;
        }, [])
        .join(', '),
  },
];

export default function EnrolmentGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseEnrolmentGroups[]
  >([]);
  const { isStaffUser } = usePermissions();
  const { data: enrolmentGroupData } = useEnrolmentGroups();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;

  const enrolmentGroupColumns = useMemo(
    () => getEnrolmentGroupColumns(t, isStaffUser),
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
