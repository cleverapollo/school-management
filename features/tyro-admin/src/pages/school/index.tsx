import {
  Box,
  Button,
  Card,
  Fade,
  Stack,
  Tab,
  Tabs,
  Typography,
  Chip,
} from '@mui/material';
import {
  ActionMenu,
  Avatar,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  RouterLink,
  Table,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  addViewSchoolHeaders,
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
        {t('admin:emulateSchool')}
      </Button>
    ),
  },
];

enum SchoolTab {
  LIVE,
  TEST,
}
export default function AdminSchoolsPage() {
  const { t } = useTranslation(['common', 'admin']);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const { data: tenants = [] } = useAdminTenants();
  const navigate = useNavigate();
  const { mutateAsync: evictTenantLevelCache } = useEvictTenantLevelCache();
  const [schoolTab, setSchoolTab] = useState<SchoolTab>(SchoolTab.LIVE);

  const tenantColumns = useMemo(
    () => getAdminTenantColumns(t, navigate),
    [t, navigate]
  );

  const filteredTenants = useMemo(
    () =>
      tenants.filter(
        ({ liveSchool }) => liveSchool === (schoolTab === SchoolTab.LIVE)
      ),
    [tenants, schoolTab]
  );

  const allTabs = useMemo(
    () => [
      {
        id: SchoolTab.LIVE,
        name: t('admin:live'),
        total: tenants.filter(({ liveSchool }) => liveSchool).length,
      },
      {
        id: SchoolTab.TEST,
        name: t('admin:test'),
        total: tenants.filter(({ liveSchool }) => !liveSchool).length,
      },
    ],
    [tenants]
  );

  return (
    <PageContainer title={t('admin:schools')}>
      <PageHeading title={t('admin:schools')} titleProps={{ variant: 'h3' }} />
      <Card
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: 2,
        }}
      >
        <Tabs
          value={schoolTab}
          onChange={(_event, newValue: SchoolTab) => setSchoolTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label={t('admin:ariaLabelForTabs')}
          sx={{
            mx: 2,
            '& .MuiTabs-flexContainer > .MuiButtonBase-root': {
              marginRight: 3.5,
            },
          }}
        >
          {allTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <Stack gap={1} flexDirection="row">
                  <Chip
                    label={tab.total}
                    variant="soft"
                    size="small"
                    sx={{
                      color: `indigo.500`,
                      backgroundColor: 'indigo.100',
                      borderRadius: '6px',
                      height: '20px',
                    }}
                  />
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    fontWeight="600"
                    sx={{
                      '[aria-selected="true"] &': {
                        color: 'slate.800',
                      },
                    }}
                  >
                    {tab.name}
                  </Typography>
                </Stack>
              }
            />
          ))}
        </Tabs>
        <Stack flex={1}>
          <Table
            rowData={filteredTenants}
            columnDefs={tenantColumns}
            rowSelection="single"
            getRowId={({ data }) => String(data?.tenant)}
            rightAdornment={
              <Fade in={!!selectedSchoolId} unmountOnExit>
                <Box>
                  <ActionMenu
                    menuItems={[
                      {
                        label: t('admin:evictTenantCache'),
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
            sx={{
              boxShadow: 'none',
            }}
          />
        </Stack>
      </Card>
    </PageContainer>
  );
}
