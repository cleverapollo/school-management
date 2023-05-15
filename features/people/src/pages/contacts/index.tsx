import { useMemo } from 'react';
import { Button, Box } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  Table,
  TablePersonAvatar,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  PageHeading,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { Link } from 'react-router-dom';
import { AddUserIcon } from '@tyro/icons';
import { useContacts } from '../../api/contact/contacts';

type ReturnTypeFromUseContacts = NonNullable<
  ReturnType<typeof useContacts>['data']
>[number];

const getContactColumns = (
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
    }: ICellRendererParams<ReturnTypeFromUseContacts, any>) =>
      data ? (
        <TablePersonAvatar
          person={data?.person}
          to={`./${data?.partyId ?? ''}`}
        />
      ) : null,
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
  },
  {
    field: 'personalInformation.preferredFirstName',
    headerName: translate('common:preferredFirstName'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: translate('common:phone'),
    editable: true,
    hide: true,
    cellEditor: 'agNumericCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(
        data ?? {},
        'personalInformation.primaryPhoneNumber.number',
        newValue
      );
      return true;
    },
  },
  {
    field: 'personalInformation.primaryEmail.email',
    headerName: translate('common:email'),
    editable: true,
    hide: true,
    cellEditor: 'agEmailCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.primaryEmail.email', newValue);
      return true;
    },
  },
];

export default function ContactsListPage() {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();
  const { data: contactsData = [] } = useContacts();

  const contactColumns = useMemo(
    () => getContactColumns(t, displayName),
    [t, displayName]
  );

  return (
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
        columnDefs={contactColumns}
        rowSelection="multiple"
        rowHeight={56}
        getRowId={({ data }) => String(data?.partyId)}
      />
    </PageContainer>
  );
}
