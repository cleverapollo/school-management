import { useMemo, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import { UseQueryReturnType } from '@tyro/api';
import {
  useNumber,
  Table,
  GridOptions,
  ActionMenu,
  TablePersonAvatar,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
} from '@tyro/core';
import { useClassGroupById } from '../../api/class-groups';
import { getPersonProfileLink } from '../../utils/get-person-profile-link';

type ReturnTypeFromUseSubjectGroupById = UseQueryReturnType<
  typeof useClassGroupById
>['students'][number];

const getClassGroupColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroupById, any>) => (
      <TablePersonAvatar
        person={data?.person}
        to={getPersonProfileLink(data?.person)}
      />
    ),
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
];

export default function ClassGroupStudentsPage() {
  const { t } = useTranslation(['common', 'people']);

  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  const { displayName } = usePreferredNameLayout();

  const [selectedMembers, setSelectedMembers] = useState<
    ReturnTypeFromUseSubjectGroupById[]
  >([]);

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      // TODO: add action logic
      onClick: () => {},
    },
  ];

  const { data: groupData } = useClassGroupById(groupIdAsNumber);

  const classGroupColumns = useMemo(
    () => getClassGroupColumns(t, displayName),
    [t, displayName]
  );

  const showActionMenu = selectedMembers.length > 0;

  return (
    <Table
      rowData={groupData?.students ?? []}
      columnDefs={classGroupColumns}
      rowSelection="multiple"
      getRowId={({ data }) => String(data?.person?.partyId)}
      rightAdornment={
        <Fade in={showActionMenu} unmountOnExit>
          <Box>
            <ActionMenu menuItems={actionMenuItems} />
          </Box>
        </Fade>
      }
      onRowSelection={setSelectedMembers}
    />
  );
}
