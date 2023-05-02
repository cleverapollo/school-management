import { Box, Container, Fade, Typography } from '@mui/material';
import { UpdateClassGroupGroupInput, usePermissions } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  ActionMenuProps,
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import {
  ArchiveIcon,
  MobileIcon,
  SendMailIcon,
  UnarchiveIcon,
} from '@tyro/icons';
import { TableStaffAutocomplete } from '@tyro/people';
import set from 'lodash/set';
import {
  useClassGroups,
  ReturnTypeFromUseClassGroups,
  useSaveClassGroupEdits,
} from '../../api/class-groups';

const getClassGroupColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  isStaffUser: boolean,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseClassGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: ({ data }) => Boolean(data) && isStaffUser,
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseClassGroups>) =>
      data ? (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
            },
          }}
        />
      ) : null,
    sort: 'asc',
  },
  {
    headerName: t('common:members'),
    valueGetter: ({ data }) =>
      data ? data.studentMembers?.memberCount ?? 0 : null,
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
    field: 'tutors',
    cellClass: 'disable-cell-edit-style',
    valueFormatter: ({ data }) => displayNames(data?.tutors),
    valueSetter: ({ data, newValue }) => {
      set(data, 'tutors', newValue ?? []);
      return true;
    },
    editable: true,
    cellEditor: TableStaffAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
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

export default function ClassGroupsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseClassGroups[]
  >([]);
  const { displayNames } = usePreferredNameLayout();
  const { isStaffUser } = usePermissions();
  const { data: classGroupData } = useClassGroups();
  const { mutateAsync: updateClassGroup } = useSaveClassGroupEdits();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;

  const classGroupColumns = useMemo(
    () => getClassGroupColumns(t, isStaffUser, displayNames),
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

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseClassGroups, 'tutors'>
  ) => {
    const updates = Object.entries(data).reduce<UpdateClassGroupGroupInput[]>(
      (acc, [partyId, changes]) => {
        const tutors = changes?.tutors?.newValue;
        const tutor =
          Array.isArray(tutors) && tutors.length > 0 ? tutors[0] : undefined;

        if (tutor) {
          acc.push({
            classGroupPartyId: Number(partyId),
            tutor: tutor?.partyId,
          });
        }

        return acc;
      },
      []
    );

    return updateClassGroup(updates);
  };

  return (
    <Page title={t('groups:classGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:classGroups')}
        </Typography>
        <Table
          rowData={classGroupData ?? []}
          columnDefs={classGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={handleBulkSave}
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
