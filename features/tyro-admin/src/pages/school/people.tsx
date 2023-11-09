import { Box, Button, Container, Typography } from '@mui/material';
import {
  Avatar,
  GridOptions,
  ICellRendererParams,
  Page,
  PageHeading,
  Table,
  useNumber,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  addEmulationHeaders,
  getUser,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useAdminPartyPeopleByTenantId } from '../../api/party-people';

type ReturnTypeFromUseAdminPartyPeopleByTenantId = UseQueryReturnType<
  typeof useAdminPartyPeopleByTenantId
>[number];

const getPeopleColumns = (
  t: TFunction<('common' | 'admin')[], undefined, ('common' | 'admin')[]>,
  navigate: ReturnType<typeof useNavigate>,
  schoolIdAsNumber: number | undefined
): GridOptions<ReturnTypeFromUseAdminPartyPeopleByTenantId>['columnDefs'] => [
  {
    colId: 'name',
    headerName: t('common:name'),
    valueGetter: ({ data }) =>
      `${data?.firstName ?? ''} ${data?.lastName ?? ''}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<
      ReturnTypeFromUseAdminPartyPeopleByTenantId,
      any
    >) => {
      const name = `${data?.firstName ?? ''} ${data?.lastName ?? ''}`;
      return (
        <Box display="flex" alignItems="center">
          <Avatar
            src={data?.avatarUrl}
            name={name}
            sx={{
              my: 1,
              mr: 1.5,
            }}
          />
          {name}
        </Box>
      );
    },
    lockVisible: true,
  },
  {
    field: 'type',
    headerName: t('common:type'),
  },
  {
    field: 'partyId',
    headerName: t('admin:partyId'),
  },
  {
    field: 'tenantId',
    headerName: t('admin:tenant'),
  },
  {
    headerName: '',
    cellRenderer: ({
      data,
    }: ICellRendererParams<
      ReturnTypeFromUseAdminPartyPeopleByTenantId,
      any
    >) => (
      <Button
        className="ag-show-on-row-interaction"
        onClick={() => {
          if (schoolIdAsNumber && data?.partyId) {
            addEmulationHeaders(schoolIdAsNumber, data?.partyId);
            queryClient.clear();
            navigate('/', { replace: true });
          }
        }}
      >
        Emulate
      </Button>
    ),
  },
];

export default function AdminPeoplesPage() {
  const { schoolId } = useParams();
  const schoolIdAsNumber = useNumber(schoolId);
  const { t } = useTranslation(['common', 'admin']);
  const navigate = useNavigate();
  const { data: people } = useAdminPartyPeopleByTenantId(schoolIdAsNumber ?? 0);

  const peopleColumns = useMemo(
    () => getPeopleColumns(t, navigate, schoolIdAsNumber),
    [t, navigate, schoolIdAsNumber]
  );

  return (
    <Page title={t('admin:people')}>
      <Container maxWidth="xl">
        <PageHeading
          title={t('admin:people')}
          breadcrumbs={{
            links: [
              {
                name: t('admin:schools'),
                href: './..',
              },
              {
                name: t('admin:people'),
              },
            ],
          }}
          mb={2}
        />
        <Table
          rowData={people ?? []}
          columnDefs={peopleColumns}
          getRowId={({ data }) => String(data?.partyId)}
        />
      </Container>
    </Page>
  );
}
