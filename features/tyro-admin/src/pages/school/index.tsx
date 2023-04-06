import { Box, Button, Container, Typography } from '@mui/material';
import {
  Avatar,
  GridOptions,
  ICellRendererParams,
  Page,
  RouterLink,
  Table,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  addViewSchoolHeaders,
  getUser,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTenants } from '../../api/tenants';

type ReturnTypeFromUseAdminTenants = UseQueryReturnType<
  typeof useAdminTenants
>[number];

const getAdminTenantColumns = (
  t: TFunction<('common' | 'admin')[], undefined, ('common' | 'admin')[]>,
  navigate: ReturnType<typeof useNavigate>
): GridOptions<ReturnTypeFromUseAdminTenants>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('admin:school'),
    valueGetter: ({ data }) => data?.name,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAdminTenants, any>) => (
      <Box display="flex" alignItems="center">
        <Avatar
          src={data?.imgUrl ?? undefined}
          name={data?.name}
          sx={{
            my: 1,
            mr: 1.5,
          }}
        />
        <RouterLink sx={{ fontWeight: 600 }} to={`./${data?.tenant ?? ''}`}>
          {data?.name}
        </RouterLink>
      </Box>
    ),
    lockVisible: true,
  },
  {
    field: 'location',
    headerName: t('admin:location'),
  },
  {
    field: 'type',
    headerName: t('common:type'),
  },
  {
    field: 'tenant',
    headerName: t('common:tenant'),
  },
  {
    headerName: '',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAdminTenants, any>) => (
      <Button
        className="ag-show-on-row-interaction"
        onClick={async () => {
          if (data?.tenant) {
            addViewSchoolHeaders(data?.tenant);
            queryClient.invalidateQueries();
            await getUser();
            navigate('/', { replace: true });
          }
        }}
      >
        Emulate school
      </Button>
    ),
  },
];

export default function AdminSchoolsPage() {
  const { t } = useTranslation(['common', 'admin']);
  const { data: tenants } = useAdminTenants();
  const navigate = useNavigate();

  const tenantColumns = useMemo(
    () => getAdminTenantColumns(t, navigate),
    [t, navigate]
  );

  return (
    <Page title={t('admin:schools')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('admin:schools')}
        </Typography>
        <Table
          rowData={tenants ?? []}
          columnDefs={tenantColumns}
          getRowId={({ data }) => String(data?.tenant)}
        />
      </Container>
    </Page>
  );
}
