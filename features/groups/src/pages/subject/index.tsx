import { Box, Fade, Container, Typography } from '@mui/material';
import { usePermissions, UserType } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Page,
  Table,
  ICellRendererParams,
  ActionMenu,
  RouterLink,
  ActionMenuProps,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
} from '@tyro/core';

import {
  MobileIcon,
  SendMailIcon,
  ArchiveIcon,
  UnarchiveIcon,
} from '@tyro/icons';

import { useSubjectGroups } from '../../api/subject-groups';
import { SubjectGroupLevelChip } from '../../components';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups>) => (
      <RouterLink sx={{ fontWeight: 600 }} to={`${data?.partyId ?? ''}`}>
        {data?.name}
      </RouterLink>
    ),
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: translate('common:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    enableRowGroup: true,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: translate('common:members'),
  },
  {
    field: 'irePP.level',
    headerName: translate('common:level'),
    filter: true,
    valueGetter: ({ data }) => data?.irePP?.level,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <SubjectGroupLevelChip level={data.irePP.level} />
      ) : null,
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: translate('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { displayNames } = usePreferredNameLayout();

  const { data: subjectGroupsData } = useSubjectGroups();
  const { userType } = usePermissions();

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseSubjectGroups[]
  >([]);

  const isAdminUserType = userType === UserType.Admin;
  const isTeacherUserType = userType === UserType.Teacher;
  const showActionMenu = isAdminUserType || isTeacherUserType;

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames),
    [t, displayNames]
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

    if (isAdminUserType) {
      return [commonActions, archiveActions];
    }

    return [commonActions];
  }, [isTeacherUserType, isAdminUserType]);

  return (
    <Page title={t('groups:subjectGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:subjectGroups')}
        </Typography>
        <Table
          rowData={subjectGroupsData ?? []}
          columnDefs={studentColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
          rightAdornment={
            <Fade
              in={showActionMenu && selectedGroups.length > 0}
              unmountOnExit
            >
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
