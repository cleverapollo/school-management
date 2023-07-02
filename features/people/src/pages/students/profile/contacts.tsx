import { useParams } from 'react-router-dom';
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
  PersonHeartIcon,
  PersonTickIcon,
  PersonCrossIcon,
} from '@tyro/icons';
import { Box, Fade } from '@mui/material';
import { SendSmsModal } from '@tyro/sms';
import {
  Core_UpdateStudentContactRelationshipInput,
  SmsRecipientType,
} from '@tyro/api';
import { RelationshipTypeCellEditor } from '../../../components/contacts/relationship-type-cell-editor';
import { useStudentsContacts } from '../../../api/student/overview';
import { joinAddress } from '../../../utils/join-address';
import { PriorityTypeCellEditor } from '../../../components/contacts/priority-cell-editor';
import { useUpdateStudentContactRelationships } from '../../../api/student/update-student-contact-relationships';

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
    field: 'personalInformation.primaryAddress.number',
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
  {
    field: 'includeInTmail',
    headerName: translate('people:includeInTmail'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.allowedToContact && data?.includeInTmail,
    valueFormatter: ({ data }) =>
      data?.includeInTmail ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.allowedToContact && data?.includeInTmail)}
      />
    ),
  },
];

export default function StudentProfileContactsPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const { toast } = useToast();

  const studentId = getNumber(id);
  const { data: contacts = [] } = useStudentsContacts(studentId);
  const { mutateAsync: updateRelationshipsAsyncMutation } =
    useUpdateStudentContactRelationships();

  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContacts[]
  >([]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
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

  const actionMenuItems = useMemo(() => {
    const isThereAtLeastOneContactThatIsNotAllowedToContact =
      selectedContacts.some((contact) => !contact?.allowedToContact);

    return [
      [
        {
          label: t('people:sendSms'),
          icon: <MobileIcon />,
          onClick: onOpenSendSms,
          disabled: recipientsForSms.length === 0,
          disabledTooltip: t('sms:recipientNotIncludedInSms', {
            count: selectedContacts.length,
          }),
        },
        // {
        //   label: t('mail:sendMail'),
        //   icon: <SendMailIcon />,
        //   onClick: () => {},
        // },
      ],
      [
        {
          label: t('people:makePrimaryContact'),
          icon: <PersonHeartIcon />,
          onClick: () => {},
          disabled: selectedContacts.length !== 1,
          disabledTooltip: t(
            'people:feedback.moreThanOneSelectedForPrimaryContact'
          ),
        },
        isThereAtLeastOneContactThatIsNotAllowedToContact
          ? {
              label: t('people:actions.allowUsersToContact'),
              icon: <PersonTickIcon />,
              onClick: () => {},
            }
          : {
              label: t('people:actions.disallowUsersToContact'),
              icon: <PersonCrossIcon />,
              onClick: () => {},
            },
      ],
    ];
  }, [selectedContacts, recipientsForSms]);

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
        rightAdornment={
          <Fade in={selectedContacts.length > 0}>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onBulkSave={handleBulkSave}
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
