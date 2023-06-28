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
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  MobileIcon,
  PersonHeartIcon,
  SendMailIcon,
  PersonTickIcon,
  PersonCrossIcon,
} from '@tyro/icons';
import { Box, Fade } from '@mui/material';
import { SendSmsModal } from '@tyro/sms';
import {
  Core_UpsertStudentContactRelationshipInput,
  SmsRecipientType,
  StudentContactRelationshipInfo,
} from '@tyro/api';
import { RelationshipTypeCellEditor } from '../../../components/contacts/relationship-type-cell-editor';
import { useStudentsContacts } from '../../../api/student/overview';
import { joinAddress } from '../../../utils/join-address';
import { PriorityTypeCellEditor } from '../../../components/contacts/priority-cell-editor';
import { useUpsertStudentContactRelationships } from '../../../api/student/upsert-student-contact-relationship';

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
    field: 'relationships.0.relationshipType',
    headerName: translate('common:relationship'),
    editable: true,
    cellEditorSelector: RelationshipTypeCellEditor(translate),
    valueFormatter: ({ data }) => {
      const contactsRelationshipType =
        data?.relationships?.[0]?.relationshipType;
      return contactsRelationshipType
        ? translate(`common:relationshipType.${contactsRelationshipType}`)
        : '';
    },
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
    field: 'relationships.0.priority',
    headerName: translate('people:priority'),
    editable: true,
    cellEditorSelector: PriorityTypeCellEditor(),
  },
  {
    field: 'relationships.0.legalGuardian',
    headerName: translate('people:legalGuardian'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.legalGuardian
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.relationships?.[0]?.legalGuardian)}
      />
    ),
  },
  {
    field: 'relationships.0.pickupRights',
    headerName: translate('people:pickupPermission'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.pickupRights
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.relationships?.[0]?.pickupRights)}
      />
    ),
  },
  {
    field: 'relationships.0.allowAccessToStudentData',
    headerName: translate('people:allowAccessToStudentData'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.allowAccessToStudentData
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.relationships?.[0]?.allowAccessToStudentData)}
      />
    ),
  },
  {
    field: 'relationships.0.allowedToContact',
    headerName: translate('people:allowedToContact'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.allowedToContact
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(data?.relationships?.[0]?.allowedToContact)}
      />
    ),
  },
  {
    field: 'relationships.0.includeInSms',
    headerName: translate('people:includedInSms'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueGetter: ({ data }) =>
      data?.relationships?.[0]?.allowedToContact &&
      data?.relationships?.[0]?.includeInSms,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.includeInSms
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(
          data?.relationships?.[0]?.allowedToContact &&
            data?.relationships?.[0]?.includeInSms
        )}
      />
    ),
  },
  {
    field: 'relationships.0.includeInTmail',
    headerName: translate('people:includeInTmail'),
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditor: TableSwitch,
    valueGetter: ({ data }) =>
      data?.relationships?.[0]?.allowedToContact &&
      data?.relationships?.[0]?.includeInTmail,
    valueFormatter: ({ data }) =>
      data?.relationships?.[0]?.includeInTmail
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => (
      <TableBooleanValue
        value={Boolean(
          data?.relationships?.[0]?.allowedToContact &&
            data?.relationships?.[0]?.includeInTmail
        )}
      />
    ),
  },
];

export default function StudentProfileContactsPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();

  const studentId = getNumber(id);
  const { data: contacts = [] } = useStudentsContacts(studentId);
  const { mutateAsync: upsertRelationshipsAsyncMutation } =
    useUpsertStudentContactRelationships();

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
        .filter((contact) => contact?.relationships?.[0]?.includeInSms)
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
      selectedContacts.some(
        (contact) => !contact?.relationships?.[0]?.allowedToContact
      );

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
      | 'relationships.0.relationshipType'
      | 'relationships.0.priority'
      | 'relationships.0.legalGuardian'
      | 'relationships.0.pickupRights'
      | 'relationships.0.allowAccessToStudentData'
      | 'relationships.0.allowedToContact'
      | 'relationships.0.includeInSms'
      | 'relationships.0.includeInTmail'
    >
  ) => {
    const dataForEndpoint = Object.keys(
      data
    ).map<Core_UpsertStudentContactRelationshipInput>((contactId) => {
      const currentData = contacts.find(
        (item) => item?.partyId === Number(contactId)
      );

      const relationship = currentData
        ?.relationships?.[0] as StudentContactRelationshipInfo;

      const contactData = data[contactId];

      const toUpdate = {
        studentPartyId: studentId!,
        contactPartyId: Number(contactId),
        relationshipType:
          contactData['relationships.0.relationshipType']?.newValue ??
          relationship.relationshipType,
        priority:
          contactData['relationships.0.priority']?.newValue ??
          relationship.priority,
        legalGuardian:
          contactData['relationships.0.legalGuardian']?.newValue ??
          relationship.legalGuardian,
        pickupRights:
          contactData['relationships.0.pickupRights']?.newValue ??
          relationship.pickupRights,
        allowAccessToStudentData:
          contactData['relationships.0.allowAccessToStudentData']?.newValue ??
          relationship.allowAccessToStudentData,
        allowedToContact:
          contactData['relationships.0.allowedToContact']?.newValue ??
          relationship.allowedToContact,
        includeInSms:
          contactData['relationships.0.includeInSms']?.newValue ??
          relationship.includeInSms,
        includeInTmail:
          contactData['relationships.0.includeInTmail']?.newValue ??
          relationship.includeInTmail,
      } as Core_UpsertStudentContactRelationshipInput;

      return {
        ...toUpdate,
        ...(!toUpdate.allowedToContact && {
          includeInSms: false,
          includeInTmail: false,
        }),
      };
    });

    return upsertRelationshipsAsyncMutation(dataForEndpoint);
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
