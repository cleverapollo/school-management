import { useParams } from 'react-router-dom';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  TableBooleanValue,
  useNumber,
  ActionMenu,
  TableSwitch,
  BulkEditedRows,
  useToast,
} from '@tyro/core';

import { Box, Fade } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  UseQueryReturnType,
  Core_UpdateStudentContactRelationshipInput,
  getPersonProfileLink,
} from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { MobileIcon, PersonHeartIcon, SendMailIcon } from '@tyro/icons';
import { useContactStudents } from '../../../api/contact/students';
import { ConfirmUnlinkModal } from '../../../components/contact/confirm-unlink-modal';
import { RelationshipTypeCellEditor } from '../../../components/contacts/relationship-type-cell-editor';
import { PriorityTypeCellEditor } from '../../../components/contacts/priority-cell-editor';
import { useUpdateStudentContactRelationships } from '../../../api/student/update-student-contact-relationships';
import { StudentTableAvatar } from '../../../components/common/student-table-avatar';

type ContactStudentsRelationships = NonNullable<
  UseQueryReturnType<typeof useContactStudents>['relationships']
>[number];

const getContactStudentsColumns = (
  t: TFunction<('people' | 'common')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ContactStudentsRelationships>['columnDefs'] => [
  {
    field: 'student.person',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student?.person}
          isPriorityStudent={!!data?.student?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.student?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
  },
  {
    field: 'student.classGroup.name',
    headerName: t('common:class'),
    filter: true,
    enableRowGroup: true,
  },
  {
    field: 'relationshipType',
    headerName: t('common:relationship'),
    editable: true,
    cellEditorSelector: RelationshipTypeCellEditor(t),
    valueFormatter: ({ data }) =>
      data?.relationshipType
        ? t(`common:relationshipType.${data?.relationshipType}`)
        : '',
  },
  {
    field: 'priority',
    headerName: t('people:priority'),
    editable: true,
    cellEditorSelector: PriorityTypeCellEditor(),
  },
  {
    field: 'legalGuardian',
    headerName: t('people:legalGuardian'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.legalGuardian ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue value={Boolean(data?.legalGuardian)} />
    ),
  },
  {
    field: 'pickupRights',
    headerName: t('people:pickupPermission'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.pickupRights ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue value={Boolean(data?.pickupRights)} />
    ),
  },
  {
    field: 'allowAccessToStudentData',
    headerName: t('people:allowAccessToStudentData'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.allowAccessToStudentData ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue value={Boolean(data?.allowAccessToStudentData)} />
    ),
  },
  {
    field: 'allowedToContact',
    headerName: t('people:allowedToContact'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.allowedToContact ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue value={Boolean(data?.allowedToContact)} />
    ),
  },
  {
    field: 'includeInSms',
    headerName: t('people:includeInSms'),
    editable: ({ data }) => !!data?.allowedToContact,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.includeInSms ? t('common:yes') : t('common:no'),
    valueGetter: ({ data }) => data?.allowedToContact && data?.includeInSms,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue
        value={Boolean(data?.allowedToContact && data?.includeInSms)}
      />
    ),
  },
  {
    field: 'includeInTmail',
    headerName: t('people:includeInTmail'),
    editable: ({ data }) => !!data?.allowedToContact,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.includeInTmail ? t('common:yes') : t('common:no'),
    valueGetter: ({ data }) => data?.allowedToContact && data?.includeInTmail,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ContactStudentsRelationships, any>) => (
      <TableBooleanValue
        value={Boolean(data?.allowedToContact && data?.includeInTmail)}
      />
    ),
  },
];

export default function ContactProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { id } = useParams();
  const contactPartyId = useNumber(id);
  const { toast } = useToast();
  const { displayName } = usePreferredNameLayout();
  const [selectedContacts, setSelectedContacts] = useState<
    ContactStudentsRelationships[]
  >([]);
  const [isShowAlertUnlink, setIsShowAlertUnlink] = useState<boolean>(false);
  const { data: contactStudentsData } = useContactStudents(contactPartyId);

  const { mutateAsync: updateRelationshipsAsyncMutation } =
    useUpdateStudentContactRelationships();

  const contactStudentColumns = useMemo(
    () => getContactStudentsColumns(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = useMemo(
    () => [
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
      // [
      //   {
      //     label: t('people:unlinkStudent'),
      //     icon: <PersonHeartIcon />,
      //     onClick: () => {
      //       setIsShowAlertUnlink(true);
      //     },
      //     disabled: selectedContacts.length !== 1,
      //     disabledTooltip: t('people:unlinkStudent'),
      //   },
      // ],
    ],
    [selectedContacts]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      NonNullable<ContactStudentsRelationships>,
      | 'relationshipType'
      | 'priority'
      | 'legalGuardian'
      | 'pickupRights'
      | 'allowAccessToStudentData'
      | 'allowedToContact'
      | 'includeInSms'
      | 'includeInTmail'
    >
  ) => {
    const dataForEndpoint = Object.keys(
      data
    ).map<Core_UpdateStudentContactRelationshipInput>((studentId) => {
      const toUpdate = Object.entries(data[studentId]).reduce(
        (acc, [key, { newValue }]) => ({
          ...acc,
          [key]: newValue,
        }),
        {} as Core_UpdateStudentContactRelationshipInput
      );

      return {
        ...toUpdate,
        studentPartyId: Number(studentId),
        contactPartyId: contactPartyId!,
      };
    });

    return updateRelationshipsAsyncMutation(dataForEndpoint);
  };

  return (
    <>
      <Table
        rowData={contactStudentsData?.relationships ?? []}
        columnDefs={contactStudentColumns}
        getRowId={({ data }) => String(data?.studentPartyId)}
        rowSelection="multiple"
        onCellValueChanged={(data) => {
          if (
            data.colDef.field === 'allowedToContact' &&
            data.newValue === false
          ) {
            toast(t('people:allowedToContactDisabled'), { variant: 'info' });
          }
        }}
        onRowSelection={setSelectedContacts}
        rightAdornment={
          <Fade in={selectedContacts.length > 0}>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onBulkSave={handleBulkSave}
      />
      <ConfirmUnlinkModal
        isOpen={isShowAlertUnlink}
        onClose={() => setIsShowAlertUnlink(false)}
      />
    </>
  );
}
