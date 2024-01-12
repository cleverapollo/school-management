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
  ReturnTypeDisplayName,
  usePreferredNameLayout,
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
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseActivitiesList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('schoolActivities:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseActivitiesList>) =>
      data && (
        <RouterLink to={`${data?.schoolActivityId}/cover-required`}>
          {data.name}
        </RouterLink>
      ),
  },
  {
    field: 'dates',
    headerName: t('common:date'),
    valueGetter: ({ data }) => {
      const dates = data?.dates?.map((date) => dayjs(date?.date).format('L'));
      if (dates && dates.length > 1) {
        return `${dates[0]} - ${dates[dates.length - 1]}`;
      }
      return dates && dates.length === 1 ? dates[0] : '-';
    },
    comparator: (valueA: string, valueB: string) => {
      const startA = valueA.split(' - ')[0];
      const startB = valueB.split(' - ')[0];

      const dateA = dayjs(startA, 'L');
      const dateB = dayjs(startB, 'L');

      if (dateA.isAfter(dateB)) {
        return -1;
      }
      return dateB.isAfter(dateA) ? 1 : 0;
    },
    sort: 'desc',
  },
  {
    field: 'tripPurpose',
    headerName: t('schoolActivities:activityDetails'),
    valueGetter: ({ data }) => data?.tripPurpose,
    maxWidth: 350,
  },
  {
    field: 'createdBy.person',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.createdBy?.person) || '-',
  },
  {
    field: 'published',
    headerName: t('common:published'),
    valueGetter: ({ data }) => data?.published || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseActivitiesList>) => (
      <TableBooleanValue value={!!data?.published} />
    ),
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
  const { displayName } = usePreferredNameLayout();
  const { data: schoolActivities, isLoading } = useActivitiesList({});

  const schoolActivitiesColumns = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

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
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
