import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  Table,
  TableBooleanValue,
  PageContainer,
  RouterLink,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { AddDocIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import {
  useActivitiesList,
  ReturnTypeFromUseActivitiesList,
} from '../api/get-school-activities';

const getColumnDefs = (
  t: TFunction<
    ('schoolActivities' | 'common')[],
    undefined,
    ('schoolActivities' | 'common')[]
  >
): GridOptions<ReturnTypeFromUseActivitiesList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('schoolActivities:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseActivitiesList>) =>
      data && (
        <RouterLink to={`${data?.schoolActivityId}/effected-classes`}>
          {data.name}
        </RouterLink>
      ),
  },
  {
    field: 'dates',
    headerName: t('schoolActivities:startDate'),
    valueGetter: ({ data }) => {
      const dates = data?.dates?.map((date) => dayjs(date?.date).format('L'));
      return dates || '-';
    },
    sort: 'desc',
  },
  {
    field: 'tripPurpose',
    headerName: t('schoolActivities:tripPurpose'),
    valueGetter: ({ data }) => data?.tripPurpose,
  },
  {
    field: 'location.inSchoolGrounds',
    headerName: t('schoolActivities:inSchool'),
    valueGetter: ({ data }) => data?.location?.inSchoolGrounds,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseActivitiesList>) => {
      if (!data) return null;

      return <TableBooleanValue value={!!data.location?.inSchoolGrounds} />;
    },
  },
  {
    field: 'location.rooms',
    headerName: t('common:room'),
    valueGetter: ({ data }) =>
      data?.location?.rooms?.map((room) => room?.name) || '-',
  },
  {
    field: 'notes',
    headerName: t('schoolActivities:note'),
    valueGetter: ({ data }) => data?.notes || '-',
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseActivitiesList>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('schoolActivities:editSchoolActivity'),
              icon: <EditIcon />,
              navigateTo: `${data?.schoolActivityId}/edit`,
            },
          ]}
        />
      ),
  },
];

export default function TestPage() {
  const { t } = useTranslation(['schoolActivities', 'common']);
  const { data: schoolActivities } = useActivitiesList({});

  const schoolActivitiesColumns = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('schoolActivities:schoolActivitiesTitle')}>
      <PageHeading
        title={t('schoolActivities:schoolActivitiesTitle')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="./create"
              startIcon={<AddDocIcon />}
            >
              {t('schoolActivities:createSchoolActivity')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={schoolActivities || []}
        columnDefs={schoolActivitiesColumns}
        getRowId={({ data }) => String(data?.schoolActivityId)}
      />
    </PageContainer>
  );
}
