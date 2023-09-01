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
  ReturnTypeDisplayNames,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { AddUserIcon } from '@tyro/icons';
import { useContacts } from '../../api/contact/list';
import { joinAddress } from '../../utils/join-address';

type ReturnTypeFromUseContacts = NonNullable<
  ReturnType<typeof useContacts>['data']
>[number];

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
  const { t } = useTranslation(['common', 'people']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { data: contactsData = [] } = useContacts();

  const contactColumns = useMemo(
    () => getContactColumns(t, displayName, displayNames),
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
        getRowId={({ data }) => String(data?.partyId)}
      />
    </PageContainer>
  );
}
