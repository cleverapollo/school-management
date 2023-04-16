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
} from '@tyro/core';
import {
  ArchiveIcon,
  MobileIcon,
  SendMailIcon,
  UnarchiveIcon,
} from '@tyro/icons';
import { useCustomGroups } from '../../api/general-groups';

type ReturnTypeFromUseCustomGroups = NonNullable<
  ReturnType<typeof useCustomGroups>['data']
>[number];

const getCustomGroupsColumns = (
  t: TFunction<
    ('common' | 'groups' | 'people' | 'mail')[],
    undefined,
    ('common' | 'groups' | 'people' | 'mail')[]
  >,
  isStaffUser: boolean
): GridOptions<ReturnTypeFromUseCustomGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: isStaffUser,
    lockVisible: true,
    sort: 'asc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCustomGroups>) => (
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
    field: 'generalGroupType',
    headerName: t('common:type'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.generalGroupType
        ? t(`groups:generalGroupType.${data.generalGroupType}`)
        : '',
  },
];

export default function CustomGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseCustomGroups[]
  >([]);
  const { isStaffUser } = usePermissions();
  const { data: customGroupData } = useCustomGroups();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;

  const customGroupColumns = useMemo(
    () => getCustomGroupsColumns(t, isStaffUser),
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
    <Page title={t('groups:customGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:customGroups')}
        </Typography>
        <Table
          rowData={customGroupData ?? []}
          columnDefs={customGroupColumns}
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
