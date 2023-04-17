import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ActionMenu,
  getNumber,
  GridOptions,
  ICellRendererParams,
  Table,
  TableAvatar,
  TableBooleanValue,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
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
      <TableAvatar
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
];

export default function StudentProfileContactsPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContacts[]
  >([]);
  const { data: contacts } = useStudentsContacts(studentId);
  const { t } = useTranslation(['common', 'people', 'mail']);
  const { displayName } = usePreferredNameLayout();

  const studentContactColumns = useMemo(
    () => getStudentContactColumns(t, displayName),
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
  }, [selectedContacts]);

  return (
    <Table
      rowData={contacts ?? []}
      columnDefs={studentContactColumns}
      tableContainerSx={{ height: 300 }}
      rowSelection="multiple"
      rowHeight={56}
      getRowId={({ data }) => String(data?.partyId)}
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
