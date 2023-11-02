import { useMemo, useState } from 'react';
import { Button, Box, Fade } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  Table,
  TablePersonAvatar,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  PageHeading,
  ReturnTypeDisplayNames,
  useDisclosure,
  ActionMenu,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { AddUserIcon, MobileIcon, SendMailIcon, TrashIcon } from '@tyro/icons';
import { useMailSettings } from '@tyro/mail';
import { SearchType, SmsRecipientType, usePermissions } from '@tyro/api';
import { SendSmsModal } from '@tyro/sms';
import { ReturnTypeFromUseContacts, useContacts } from '../../api/contact/list';
import { joinAddress } from '../../utils/join-address';
import { DeleteContactsDialog } from '../../components/staff/delete-contact-dialog';

const getContactColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName,
  displayNames: ReturnTypeDisplayNames
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
        to={`./${data?.partyId ?? ''}`}
      />
    ),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: translate('common:phone'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.primaryPhoneNumber?.number ?? '-',
  },
  {
    field: 'personalInformation.primaryAddress',
    headerName: translate('common:address'),
    valueGetter: ({ data }) =>
      joinAddress(data?.personalInformation?.primaryAddress),
  },
  {
    field: 'relationships',
    headerName: translate('common:students'),
    valueGetter: ({ data }) =>
      displayNames(
        data?.relationships?.map((relationship) => relationship?.student.person)
      ),
  },
];

export default function ContactsListPage() {
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { data: contactsData = [] } = useContacts();
  const { composeEmail } = useMailSettings();
  const { hasPermission } = usePermissions();
  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContacts[]
  >([]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();
  const {
    isOpen: isDeleteContactsOpen,
    onOpen: onOpenDeleteContacts,
    onClose: onCloseDeleteContacts,
  } = useDisclosure();

  const contactColumns = useMemo(
    () => getContactColumns(t, displayName, displayNames),
    [t, displayName]
  );

  const recipientsForSms = useMemo(
    () =>
      selectedContacts
        .filter((contact) =>
          contact.relationships?.some(
            (relationship) => relationship?.includeInSms
          )
        )
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
        .filter((contact) =>
          contact.relationships?.some(
            (relationship) => relationship?.includeInSms
          )
        )
        .map(({ partyId, person }) => ({
          partyId,
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
      hasPermission('api:core:write:student_contact_archive')
        ? [
            {
              label: t('people:deleteContacts', {
                count: selectedContacts.length,
              }),
              icon: <TrashIcon />,
              onClick: onOpenDeleteContacts,
            },
          ]
        : [],
    ],
    [
      t,
      selectedContacts,
      onOpenSendSms,
      onOpenDeleteContacts,
      recipientsForSms,
      hasPermission,
    ]
  );

  return (
    <>
      <PageContainer title={t('people:pageTitle.contacts')}>
        <PageHeading
          title={t('people:pageHeading.contacts')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                component={Link}
                to="./create"
                startIcon={<AddUserIcon />}
              >
                {t('people:createContact')}
              </Button>
            </Box>
          }
        />
        <Table
          rowData={contactsData || []}
          rowSelection="multiple"
          columnDefs={contactColumns}
          rightAdornment={
            <Fade in={selectedContacts.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(rows) => {
            setSelectedContacts(rows);
          }}
          getRowId={({ data }) => String(data?.partyId)}
        />
      </PageContainer>
      <DeleteContactsDialog
        open={isDeleteContactsOpen}
        onClose={onCloseDeleteContacts}
        selectedContacts={selectedContacts}
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
