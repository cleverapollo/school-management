import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ActionMenu,
  getNumber,
  GridOptions,
  ICellRendererParams,
  Table,
  TablePersonAvatar,
  TableBooleanValue,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  useDisclosure,
  TableSwitch,
  BulkEditedRows,
  useToast,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  MobileIcon,
  AddUserIcon,
  PersonGearIcon,
  SendMailIcon,
} from '@tyro/icons';
import { SendSmsModal } from '@tyro/sms';
import {
  Core_UpdateStudentContactRelationshipInput,
  SearchType,
  SmsRecipientType,
} from '@tyro/api';
import { useMailSettings } from '@tyro/mail';
import { RelationshipTypeCellEditor } from '../../../components/contacts/relationship-type-cell-editor';
import { useStudentsContacts } from '../../../api/student/overview';
import { joinAddress } from '../../../utils/join-address';
import { PriorityTypeCellEditor } from '../../../components/contacts/priority-cell-editor';
import { useUpdateStudentContactRelationships } from '../../../api/student/update-student-contact-relationships';
import { StudentSelectOption, useStudent } from '../../../api/student/students';
import { ManageContactsModal } from '../../../components/students/manage-contacts-modal';

type ReturnTypeFromUseContacts = NonNullable<
  ReturnType<typeof useStudentsContacts>['data']
>[number];

const getStudentContactColumns = (
  translate: TFunction<
    ('common' | 'people')[],
    undefined,
    ('common' | 'people')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseContacts>['columnDefs'] => [
  {
    field: 'person',
    headerName: translate('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TablePersonAvatar
        person={data?.person}
        to={`/people/contacts/${data?.partyId ?? ''}`}
      />
    ),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'relationshipType',
    headerName: translate('common:relationship'),
    editable: true,
    cellEditorSelector: RelationshipTypeCellEditor(translate),
    valueFormatter: ({ data }) =>
      data?.relationshipType
        ? translate(`common:relationshipType.${data?.relationshipType}`)
        : '',
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: translate('common:phone'),
  },
  {
    field: 'personalInformation.primaryEmail.email',
    headerName: translate('common:email'),
  },
  {
    field: 'personalInformation.primaryAddress',
    headerName: translate('common:address'),
    valueGetter: ({ data }) =>
      joinAddress(data?.personalInformation?.primaryAddress, {
        emptyValue: '',
      }),
  },
  {
    field: 'priority',
    headerName: translate('people:priority'),
    editable: true,
    cellEditorSelector: PriorityTypeCellEditor(),
  },
  {
    field: 'legalGuardian',
    headerName: translate('people:legalGuardian'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.legalGuardian ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue value={Boolean(data?.legalGuardian)} />
    ),
  },
  {
    field: 'pickupRights',
    headerName: translate('people:pickupPermission'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.pickupRights ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue value={Boolean(data?.pickupRights)} />
    ),
  },
  {
    field: 'allowAccessToStudentData',
    headerName: translate('people:allowAccessToStudentData'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.allowAccessToStudentData
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue value={Boolean(data?.allowAccessToStudentData)} />
    ),
  },
  {
    field: 'allowedToContact',
    headerName: translate('people:allowedToContact'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.allowedToContact ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue value={Boolean(data?.allowedToContact)} />
    ),
  },
  {
    field: 'includeInSms',
    headerName: translate('people:includedInSms'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.allowedToContact && data?.includeInSms,
    valueFormatter: ({ data }) =>
      data?.includeInSms ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.allowedToContact && data?.includeInSms)}
      />
    ),
  },
  // {
  //   field: 'includeInTmail',
  //   headerName: translate('people:includeInTmail'),
  //   editable: true,
  //   cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
  //   cellEditor: TableSwitch,
  //   valueGetter: ({ data }) => data?.allowedToContact && data?.includeInTmail,
  //   valueFormatter: ({ data }) =>
  //     data?.includeInTmail ? translate('common:yes') : translate('common:no'),
  //   cellRenderer: ({
  //     data,
  //   }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
  //     <TableBooleanValue
  //       value={Boolean(data?.allowedToContact && data?.includeInTmail)}
  //     />
  //   ),
  // },
];

export default function StudentProfileContactsPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const { toast } = useToast();
  const navigate = useNavigate();

  const studentId = getNumber(id);
  const { data: studentData } = useStudent(studentId);
  const { data: contacts = [] } = useStudentsContacts(studentId);
  const { mutateAsync: updateRelationshipsAsyncMutation } =
    useUpdateStudentContactRelationships();
  const { composeEmail } = useMailSettings();

  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContacts[]
  >([]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();
  const {
    isOpen: isManageContactsModalOpen,
    onOpen: onOpenManageContactsModal,
    onClose: onCloseManageContactsModal,
  } = useDisclosure();

  const studentContactColumns = useMemo(
    () => getStudentContactColumns(t, displayName),
    [t, displayName]
  );

  const recipientsForSms = useMemo(
    () =>
      selectedContacts
        .filter((contact) => contact?.includeInSms)
        .map(
          (contact) =>
            ({
              id: contact?.partyId ?? 0,
              name: displayName(contact?.person),
              type: 'individual',
              avatarUrl: contact?.person?.avatarUrl,
            } as const)
        ) ?? [],
    [selectedContacts]
  );

  const recipientsForMail = useMemo(
    () =>
      selectedContacts
        .filter((contact) => contact?.allowedToContact)
        .map(({ person }) => ({
          partyId: person.partyId,
          type: SearchType.Contact,
          text: displayName(person),
          avatarUrl: person.avatarUrl,
        })) ?? [],
    [selectedContacts]
  );

  const sendMailToSelectedContacts = () => {
    composeEmail({
      canReply: false,
      bccRecipients: recipientsForMail,
    });
  };

  const actionMenuItems = useMemo(
    () => [
      selectedContacts.length
        ? [
            {
              label: t('people:sendSms'),
              icon: <MobileIcon />,
              onClick: onOpenSendSms,
              disabled: recipientsForSms.length === 0,
              disabledTooltip: t('sms:recipientNotIncludedInSms', {
                count: selectedContacts.length,
              }),
            },
            {
              label: t('mail:sendMail'),
              icon: <SendMailIcon />,
              onClick: sendMailToSelectedContacts,
              disabled: recipientsForMail.length === 0,
              disabledTooltip: t('sms:recipientNotAllowedToContact', {
                count: selectedContacts.length,
              }),
            },
          ]
        : [],
      [
        {
          label: t('people:manageContacts'),
          icon: <PersonGearIcon />,
          onClick: onOpenManageContactsModal,
        },
        {
          label: t('people:createContact'),
          icon: <AddUserIcon />,
          onClick: () => {
            if (!studentData) return;
            const currentStudentAsOption: StudentSelectOption = {
              ...studentData?.person,
              caption: studentData.classGroup?.name,
            };
            navigate(`/people/contacts/create`, {
              state: {
                students: [currentStudentAsOption],
              },
            });
          },
        },
      ],
    ],
    [selectedContacts, recipientsForSms, onOpenManageContactsModal]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseContacts,
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
    ).map<Core_UpdateStudentContactRelationshipInput>((contactId) => {
      const toUpdate = Object.entries(data[contactId]).reduce(
        (acc, [key, { newValue }]) => ({
          ...acc,
          [key]: newValue,
        }),
        {} as Core_UpdateStudentContactRelationshipInput
      );

      return {
        ...toUpdate,
        studentPartyId: studentId!,
        contactPartyId: Number(contactId),
      };
    });

    return updateRelationshipsAsyncMutation(dataForEndpoint);
  };

  return (
    <>
      <Table
        rowData={contacts ?? []}
        columnDefs={studentContactColumns}
        tableContainerSx={{ height: 300 }}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.partyId)}
        onRowSelection={(rows) => {
          setSelectedContacts(rows);
        }}
        onCellValueChanged={(data) => {
          if (
            data.colDef.field === 'allowedToContact' &&
            data.newValue === false
          ) {
            toast(t('people:allowedToContactDisabled'), { variant: 'info' });
          }
        }}
        rightAdornment={<ActionMenu menuItems={actionMenuItems} />}
        onBulkSave={handleBulkSave}
      />
      <ManageContactsModal
        studentPartyId={studentId ?? 0}
        open={isManageContactsModalOpen}
        onClose={onCloseManageContactsModal}
        currentContacts={contacts}
      />
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={recipientsForSms}
        hideRecipientTypes
        possibleRecipientTypes={[
          {
            label: '',
            type: SmsRecipientType.Contact,
          },
        ]}
      />
    </>
  );
}
