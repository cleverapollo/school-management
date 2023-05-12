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
import { SmsRecipientType } from '@tyro/api';
import { useStudentsContacts } from '../../../api/student/overview';
import { joinAddress } from '../../../utils/join-address';

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
    field: 'personalInformation.primaryAddress.number',
    headerName: translate('common:address'),
    valueGetter: ({ data }) =>
      joinAddress(data?.personalInformation?.primaryAddress, {
        emptyValue: '',
      }),
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
    field: 'relationships[0].relationshipType',
    headerName: translate('common:relationship'),
    valueGetter: ({ data }) => {
      const contactsRelationshipType =
        data?.relationships?.[0]?.relationshipType;
      return contactsRelationshipType
        ? translate(`common:relationshipType.${contactsRelationshipType}`)
        : '';
    },
  },
  {
    field: 'relationships[0].primaryContact',
    headerName: translate('people:primaryContact'),
    valueGetter: ({ data }) =>
      data?.relationships?.[0]?.primaryContact ? 'Yes' : 'No',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => {
      const isPrimaryContact =
        data?.relationships?.[0]?.primaryContact ?? false;

      return <TableBooleanValue value={isPrimaryContact} />;
    },
  },
  {
    field: 'relationships[0].allowedToContact',
    headerName: translate('people:allowedToContact'),
    valueGetter: ({ data }) =>
      data?.relationships?.[0]?.allowedToContact ? 'Yes' : 'No',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => {
      const isAllowedToContact =
        data?.relationships?.[0]?.allowedToContact ?? false;

      return <TableBooleanValue value={isAllowedToContact} />;
    },
  },
  {
    field: 'relationships[0].includeInSms',
    headerName: translate('people:includedInSms'),
    valueGetter: ({ data }) =>
      data?.relationships?.[0]?.includeInSms ? 'Yes' : 'No',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) => {
      const isIncludedInSms = data?.relationships?.[0]?.includeInSms ?? false;

      return <TableBooleanValue value={isIncludedInSms} />;
    },
  },
];

export default function StudentProfileContactsPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContacts[]
  >([]);
  const { data: contacts } = useStudentsContacts(studentId);
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
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
        .map((contact) => ({
          id: contact?.partyId ?? 0,
          name: displayName(contact?.person),
        })) ?? [],
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
      />
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={recipientsForSms}
        showRecipientTypes={false}
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
