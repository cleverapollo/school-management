import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  useNumber,
  TableAvatar,
  ActionMenu,
  displayName,
} from '@tyro/core';

import { MobileIcon, SendMailIcon } from '@tyro/icons';
import { usePermissions, UserType } from '@tyro/api';
import { Fade, Box } from '@mui/material';

import { useSubjectGroupById } from '../../../api';

type ReturnTypeFromUseSubjectGroupById = NonNullable<
  NonNullable<ReturnType<typeof useSubjectGroupById>['data']>['students']
>[number];

const getSubjectGroupsColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroupById>) => {
      const person = data?.person;
      const name = displayName(person);

      return (
        <TableAvatar
          name={name}
          avatarUrl={person?.avatarUrl}
          to={`/people/students/${data?.partyId ?? ''}`}
        />
      );
    },
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
  {
    field: 'classGroup',
    headerName: translate('common:classGroup'),
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
  },
];

export default function SubjectGroupProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseSubjectGroupById[]
  >([]);

  const { userType } = usePermissions();

  const isAdminUserType = userType === UserType.Admin;
  const isTeacherUserType = userType === UserType.Teacher;
  const showActionMenu = isAdminUserType || isTeacherUserType;

  const studentColumns = useMemo(() => getSubjectGroupsColumns(t), [t]);

  return (
    <Table
      rowData={subjectGroupData?.students ?? []}
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
              menuItems={[
                {
                  label: t('people:sendSms'),
                  icon: <MobileIcon />,
                  // TODO: add action logic
                  onClick: () => {},
                },
                {
                  label: t('mail:sendMail'),
                  icon: <SendMailIcon />,
                  // TODO: add action logic
                  onClick: () => {},
                },
              ]}
            />
          </Box>
        </Fade>
      }
      onRowSelection={setSelectedGroups}
    />
  );
}
