import {
  Box,
  Button,
  Card,
  Container,
  Fade,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
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
import MyChip from '@mui/material/Chip';
import { useAdminTenants, useEvictTenantLevelCache } from '../../api/tenants';

type ReturnTypeFromUseAdminTenants = UseQueryReturnType<
  typeof useAdminTenants
>[number];

enum SchoolTab {
  LIVE = 'Live',
  TEST = 'Test',
}

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
  const [currentTabValue, setCurrentTabValue] = useState<SchoolTab>(
    SchoolTab.LIVE
  );
  const [value, setValue] = useState(0);

  const tenantColumns = useMemo(
    () => getAdminTenantColumns(t, navigate),
    [t, navigate]
  );

  const filteredTenants = useMemo(
    () =>
      tenants?.filter(
        ({ liveSchool }) => liveSchool === (currentTabValue === SchoolTab.LIVE)
      ) ?? [],
    [tenants, currentTabValue]
  );

  const allTabs = [
    {
      id: SchoolTab.LIVE,
      colour: 'indigo',
      name: SchoolTab.LIVE,
    },
    {
      id: SchoolTab.TEST,
      colour: 'indigo',
      name: SchoolTab.TEST,
    },
  ];
  const getSchoolsTotals = (tabValue?: SchoolTab) =>
    tenants?.filter((tag) => tag?.liveSchool === (tabValue === SchoolTab.LIVE))
      .length;

  return (
    <Page title={t('admin:schools')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('admin:schools')}
        </Typography>
        <Card
          sx={{
            backgroundColor: '#ffffff',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'indigo.50',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 2,
          }}
        >
          <Tabs
            value={value}
            onChange={(_event, newValue: number) => setValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label={t('admin:ariaLabelForTabs')}
            sx={{
              '& .MuiTabs-flexContainer': {
                alignItems: 'center',
                marginLeft: 2,
              },
              '& .MuiTabs-flexContainer > .MuiButtonBase-root': {
                marginRight: 3.5,
              },
            }}
          >
            {allTabs?.map((tab) => {
              const total = getSchoolsTotals(tab?.name ?? '');
              return (
                <Tab
                  key={tab?.id}
                  onClick={() => setCurrentTabValue(tab?.name ?? '')}
                  label={
                    <>
                      <MyChip
                        label={total}
                        variant="soft"
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: `${tab?.colour ?? 'indigo'}.100`,
                          borderRadius: '6px',
                          height: '20px',
                          fontWeight: '700',
                          fontSize: '12px',
                          paddingX: '8px',
                          color: `${tab?.colour ?? 'indigo'}.500`,
                          '& .MuiChip-icon': {
                            color: `${tab?.colour ?? 'indigo'}.500` ?? '',
                          },
                          '& .MuiChip-label': {
                            padding: 0,
                          },
                        }}
                      />
                      <Typography
                        color="#637381"
                        marginLeft={1}
                        sx={{
                          fontWeight: '600',
                          fontSize: '14px',
                          textWrap: 'nowrap',
                          textTransform: 'none',
                        }}
                      >
                        {tab?.name}
                      </Typography>
                    </>
                  }
                />
              );
            })}
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
              sx={{
                height: '100%',
                boxShadow: 'none',
                p: 0,
                '& .MuiStack-root': { paddingX: 0 },
              }}
            />
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
