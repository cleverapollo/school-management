/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Box, Fade, Container, Typography } from '@mui/material';
import { Person, usePermissions, UserType } from '@tyro/api';
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
} from '@tyro/core';

import {
  MobileIcon,
  SendMailIcon,
  ArchiveIcon,
  UnarchiveIcon,
} from '@tyro/icons';

import { displayName } from '../../../../../src/utils/nameUtils';
import { useSubjectGroups } from '../../api/subject-groups';
import { SubjectGroupLevelChip } from '../../components';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>
): GridOptions<ReturnTypeFromUseSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
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
    valueGetter: ({ data }) => {
      const teachers = data?.staff as Person[];
      if (teachers.length === 0) return '-';

      return teachers.map(displayName).join(', ');
    },
    enableRowGroup: true,
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);

  const { data: subjectGroupsData } = useSubjectGroups();
  const { userType } = usePermissions();

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseSubjectGroups[]
  >([]);

  const isAdminUserType = userType === UserType.Admin;
  const isTeacherUserType = userType === UserType.Teacher;
  const showActionMenu = isAdminUserType || isTeacherUserType;

  const studentColumns = useMemo(() => getSubjectGroupsColumns(t), [t]);

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
