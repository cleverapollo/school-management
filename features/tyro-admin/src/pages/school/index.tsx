import { Box, Button, Container, Fade, Typography } from '@mui/material';
import {
  ActionMenu,
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
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrushCircleIcon } from '@tyro/icons';
import { useAdminTenants, useEvictTenantLevelCache } from '../../api/tenants';

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
          src={data?.imgUrl}
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
    checkboxSelection: ({ data }) => Boolean(data),
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
        onClick={() => {
          if (data?.tenant) {
            addViewSchoolHeaders(data?.tenant);
            queryClient.clear();
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
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const { data: tenants } = useAdminTenants();
  const navigate = useNavigate();
  const { mutateAsync: evictTenantLevelCache } = useEvictTenantLevelCache();

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
          rowSelection="single"
          getRowId={({ data }) => String(data?.tenant)}
          rightAdornment={
            <Fade in={!!selectedSchoolId} unmountOnExit>
              <Box>
                <ActionMenu
                  menuItems={[
                    {
                      label: 'Evict tenant cache',
                      icon: <BrushCircleIcon />,
                      onClick: () =>
                        selectedSchoolId &&
                        evictTenantLevelCache(selectedSchoolId),
                    },
                  ]}
                />
              </Box>
            </Fade>
          }
          onRowSelection={(newSelectedSchools) => {
            const [newSelectedSchool] = newSelectedSchools;
            setSelectedSchoolId(newSelectedSchool?.tenant ?? null);
          }}
        />
      </Container>
    </Page>
  );
}
