import { useParams } from 'react-router-dom';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  ReturnTypeDisplayName,
  StudyLevelSelectCellEditor,
  TableAvatar,
  useNumber,
  ActionMenu,
} from '@tyro/core';
import { Box, Fade } from '@mui/material';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import {
  MobileIcon,
  PersonHeartIcon,
  SendMailIcon,
  PersonTickIcon,
  PersonCrossIcon,
} from '@tyro/icons';
import { useContactStudents } from '../../../api';

type ReturnTypeFromUseContactStudents = NonNullable<
  ReturnType<typeof useContactStudents>['data']
>[number];

const getContactStudentsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseContactStudents>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents>) => {
      if (!data) return null;

      const student = data?.student;

      return (
        <TableAvatar
          name={displayName(student?.person) ?? ''}
          to={`/people/students/${student?.partyId ?? ''}`}
          avatarUrl={student?.person?.avatarUrl}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'classes',
    headerName: t('common:class'),
    filter: true,
    valueGetter: ({ data }) => '',
    enableRowGroup: true,
  },
  {
    field: 'relationship',
    headerName: t('people:relationshipToStudent'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'priority',
    headerName: t('people:priority'),
    valueGetter: ({ data }) => '1',
    enableRowGroup: true,
  },
  {
    field: 'legalGuardian',
    headerName: t('people:legalGuardian'),
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'pickupPermission',
    headerName: t('people:pickupPermission'),
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'allowAccessToStudentData',
    headerName: t('people:allowAccessToStudentData'),
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'includeInSms',
    headerName: t('people:includeInSms'),
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'includeInTmail',
    headerName: t('people:includeInTmail'),
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
];

export default function ContactProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { displayName } = usePreferredNameLayout();
  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContactStudents[]
  >([]);
  const { data: contactStudentsData } = useContactStudents(idNumber);
  console.log('data', contactStudentsData);

  const contactStudentColumns = useMemo(
    () => getContactStudentsColumns(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = useMemo(() => {
    const isThereAtLeastOneContactThatIsNotAllowedToContact =
      selectedContacts.some(
        (contact) => !contact?.relationships?.[0]?.allowedToContact
      );

    return [
      [
        {
          label: t('people:sendSms'),
          icon: <MobileIcon />,
          onClick: () => {},
        },
        {
          label: t('mail:sendMail'),
          icon: <SendMailIcon />,
          onClick: () => {},
        },
      ],
      [
        {
          label: t('people:unlinkStudent'),
          icon: <PersonHeartIcon />,
          onClick: () => {},
          disabled: selectedContacts.length !== 1,
          disabledTooltip: t(
            'people:feedback.moreThanOneSelectedForPrimaryContact'
          ),
        },
      ],
    ];
  }, [selectedContacts]);

  return (
    <Table
      rowData={contactStudentsData ?? []}
      columnDefs={contactStudentColumns}
      getRowId={({ data }) => String(data?.studentPartyId)}
      rowSelection="multiple"
      onRowSelection={(rows) => {
        setSelectedContacts(rows);
      }}
      rightAdornment={
        <Fade in={selectedContacts.length > 0}>
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
    />
  );
}
