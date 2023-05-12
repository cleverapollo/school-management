import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TablePersonAvatar,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { useContacts } from '../../api/contacts';

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
  const { data: contacts, isLoading } = useContacts();

  const contactColumns = useMemo(
    () => getContactColumns(t, displayName),
    [t, displayName]
  );

  if (isLoading) {
    return null;
  }

  return (
    <Page title={t('people:contacts')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('people:contacts')}
        </Typography>
        <Table
          rowData={contacts ?? []}
          columnDefs={contactColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
        />
      </Container>
    </Page>
  );
}
