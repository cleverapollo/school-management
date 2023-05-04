import { useParams } from 'react-router-dom';
import { Box, Fade } from '@mui/material';
import { usePermissions, UserType } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  ActionMenu,
  ActionMenuProps,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  TableAvatar,
  getNumber,
} from '@tyro/core';

import {
  MobileIcon,
  SendMailIcon,
  ArchiveIcon,
  UnarchiveIcon,
} from '@tyro/icons';

import set from 'lodash/set';
import { useStudentsSubjectGroups } from '../../../api/student';

type ReturnTypeFromUseStudentsSubjectGroups = NonNullable<
  ReturnType<typeof useStudentsSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseStudentsSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0] ?? null;
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
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
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    enableRowGroup: true,
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { displayNames } = usePreferredNameLayout();

  const { data: subjectGroupsData } = useStudentsSubjectGroups(studentId);
  const { userType } = usePermissions();

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseStudentsSubjectGroups[]
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
    <Table
      rowData={subjectGroupsData ?? []}
      columnDefs={studentColumns}
      rowSelection="multiple"
      getRowId={({ data }) => String(data?.partyId)}
      rightAdornment={
        <Fade in={showActionMenu && selectedGroups.length > 0} unmountOnExit>
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
  );
}
