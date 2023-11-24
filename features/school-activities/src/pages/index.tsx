import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  RouterLink,
  Table,
  TableBooleanValue,
  usePreferredNameLayout,
  PageContainer,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AddDocIcon } from '@tyro/icons';
import { useAcademicNamespace, usePermissions } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

interface TripRecord {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  tripPurpose: string;
  inSchool: boolean;
  room: string;
  note: string;
}

const schoolActivitiesData: TripRecord[] = [
  {
    id: 1,
    name: 'John Doe',
    startDate: '2023-11-01',
    endDate: '2023-11-10',
    tripPurpose: 'Conference',
    inSchool: false,
    room: '101A',
    note: 'Attend the International Tech Summit',
  },
  {
    id: 2,
    name: 'Jane Smith',
    startDate: '2023-12-05',
    endDate: '2023-12-12',
    tripPurpose: 'Research',
    inSchool: true,
    room: '201B',
    note: 'Field research for thesis',
  },
  {
    id: 3,
    name: 'Emily Johnson',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    tripPurpose: 'Workshop',
    inSchool: false,
    room: '105C',
    note: 'Leading a creative writing workshop',
  },
  {
    id: 4,
    name: 'Michael Brown',
    startDate: '2024-02-10',
    endDate: '2024-02-18',
    tripPurpose: 'Sabbatical',
    inSchool: true,
    room: '301D',
    note: 'Sabbatical leave for book writing',
  },
];

const getColumnDefs = (
  t: TFunction<
    ('schoolActivities' | 'common')[],
    undefined,
    ('schoolActivities' | 'common')[]
  >
): GridOptions<TripRecord>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('schoolActivities:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    sort: 'asc',
    // cellRenderer: ({ data }: ICellRendererParams<TripRecord>) =>
    // data ? (
    //   <TableAvatar
    //     name={data?.name ?? ''}
    //     to={`./${data?.yearGroupEnrollmentPartyId ?? ''}`}
    //     avatarUrl={undefined}
    //     AvatarProps={{
    //       sx: {
    //         borderRadius: 1,
    //       },
    //     }}
    //   />
    // ) : null,
  },
  {
    field: 'startDate',
    headerName: t('schoolActivities:startDate'),
    valueGetter: ({ data }) =>
      data ? dayjs(data.startDate).format('LL') : null,
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'endDate',
    headerName: t('schoolActivities:endDate'),
    valueGetter: ({ data }) => (data ? dayjs(data.endDate).format('LL') : null),
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'tripPurpose',
    headerName: t('schoolActivities:tripPurpose'),
  },
  {
    field: 'inSchool',
    headerName: 'In school',
  },
  {
    field: 'room',
    headerName: 'Room',
  },
  {
    field: 'note',
    headerName: 'Note',
  },
];

export default function TestPage() {
  const { t } = useTranslation(['schoolActivities', 'common']);

  const { hasPermission } = usePermissions();
  const { activeAcademicNamespace } = useAcademicNamespace();
  const { displayName } = usePreferredNameLayout();

  const schoolActivitiesColumns = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('schoolActivities:title')}>
      <PageHeading
        title={t('schoolActivities:title')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="./activity/create"
              startIcon={<AddDocIcon />}
            >
              {t('schoolActivities:createSchoolActivity')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={schoolActivitiesData || []}
        columnDefs={schoolActivitiesColumns}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
