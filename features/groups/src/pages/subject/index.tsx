/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Box, Fade, Container, Typography } from '@mui/material';
import { Person, UserType, useUser } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Page,
  Table,
  ICellRendererParams,
  ActionMenu,
  MenuItemConfig,
  RouterLink,
} from '@tyro/core';

import {
  MobileIcon,
  SendMailIcon,
  ArchiveIcon,
  UnarchiveIcon,
} from '@tyro/icons';

import { displayName } from '../../../../../src/utils/nameUtils';
import { useSubjectGroups } from '../../api/subject-groups';
import { SubjectGroupLevelChip } from '../../components/subject-group-level-chip';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  translate: TFunction<
    ('common' | 'groups')[],
    undefined,
    ('common' | 'groups')[]
  >,
  isAdminUserType: boolean
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
      <RouterLink
        sx={{ fontWeight: 600 }}
        to={`${data?.partyId ?? ''}/students`}
      >
        {data?.name}
      </RouterLink>
    ),
  },
  {
    field: 'subjects',
    headerName: translate('groups:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
  },
  {
    field: 'studentMembers.memberCount',
    headerName: translate('groups:members'),
  },
  {
    field: 'irePP.level',
    headerName: translate('groups:level'),
    filter: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <SubjectGroupLevelChip level={data.irePP.level} />
      ) : null,
  },
  {
    field: 'staff',
    headerName: isAdminUserType
      ? translate('groups:teacher')
      : translate('groups:programme'),
    valueGetter: ({ data }) => {
      const teachers = data?.staff as Person[];
      if (teachers.length === 0) return '-';

      return teachers.map(displayName).join(',');
    },
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);

  const { activeProfile } = useUser();
  const { data: subjectGroupsData } = useSubjectGroups();

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseSubjectGroups[]
  >([]);

  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;
  const isTeacherUserType = profileTypeName === UserType.Teacher;
  const showActionMenu = isAdminUserType || isTeacherUserType;

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, isAdminUserType),
    [t, isAdminUserType]
  );

  const actionMenuItems = useMemo<MenuItemConfig[][]>(() => {
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

    if (isTeacherUserType) {
      return [commonActions];
    }

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
            showActionMenu ? (
              <Fade in={selectedGroups.length > 0}>
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
            ) : undefined
          }
          onRowSelection={setSelectedGroups}
        />
      </Container>
    </Page>
  );
}
