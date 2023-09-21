import { Box, Button, Fade } from '@mui/material';

import { AddIcon } from '@tyro/icons';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  useDebouncedValue,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

dayjs.extend(LocalizedFormat);

type Data = {
  id: number;
  name: string;
  attendance: string;
  date: string;
  note: string;
  createdOn: string;
  createdBy: string;
};
const bulkAttendanceData = [
  {
    id: 1,
    name: 'Michael Story',
    attendance: 'School activity',
    date: '17/09/2023 from 10:00 to 13:00',
    note: 'Home match',
    createdOn: '15/09/2023',
    createdBy: 'Maurice Moss',
  },
  {
    id: 2,
    name: 'Paris trip',
    attendance: 'School activity',
    date: '05/09/2023 - 10/09/2023',
    note: 'Transition year trip to Paris',
    createdOn: '01/09/2023',
    createdBy: 'Mars Malone',
  },
];

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<Data>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
  {
    field: 'attendance',
    headerName: t('common:attendance'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
  {
    field: 'date',
    headerName: t('common:date'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
  {
    field: 'note',
    headerName: t('common:note'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
  {
    field: 'createdOn',
    headerName: t('attendance:createdOn'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    // valueGetter: ({ data }) => data?.name ?? '-',
  },
];

export default function BulkAttendance() {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();

  const columns = useMemo(() => getColumns(t, displayName), [t]);

  return (
    <PageContainer title={t('attendance:bulkAttendance')}>
      <PageHeading
        title={t('attendance:bulkAttendance')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => console.log('Create Bulk attendance')}
              startIcon={<AddIcon />}
            >
              {t('attendance:createBulkAttendance')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={bulkAttendanceData ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
