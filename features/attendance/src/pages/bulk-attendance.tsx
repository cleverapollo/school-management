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
import { BulkAttendanceModal } from '../components/bulk-attendance/index';
import {
  useBulkAttendance,
  ReturnTypeFromUseBulkAttendance,
} from '../api/bulk-attendance/bulk-attendance';

dayjs.extend(LocalizedFormat);

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
  t: TFunction<
    ('common' | 'attendance')[],
    undefined,
    ('common' | 'attendance')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseBulkAttendance>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'id',
    valueGetter: ({ data }) =>
      data?.parties?.map((party) => {
        if (party?.__typename === 'Student') {
          return displayName(party?.person);
        }
        if (party?.__typename === 'SubjectGroup') {
          return party?.actualName;
        }
      }),
  },
  {
    field: 'attendanceCode.name',
    headerName: t('common:attendance'),
    valueGetter: ({ data }) => data?.attendanceCodeId ?? '-',
  },
  {
    field: 'startDate',
    headerName: t('common:date'),
    valueGetter: ({ data }) => {
      const startDate = dayjs(data?.startDate).format('DD/MM/YYYY');
      const endDate = dayjs(data?.endDate).format('DD/MM/YYYY');
      const dates = endDate ? `${startDate} - ${endDate}` : startDate;
      const partial = `${dayjs(data?.startDate).format('DD/MM/YYYY')} from ${
        data?.leavesAt ?? '-'
      } to ${data?.returnsAt ?? '-'}`;
      const date = data?.leavesAt ? partial : dates;
      return date;
    },
  },
  {
    field: 'note',
    headerName: t('common:note'),
    valueGetter: ({ data }) => data?.note ?? '-',
  },
  {
    field: 'createdOn',
    headerName: t('attendance:createdOn'),
    valueFormatter: ({ data }) =>
      dayjs(data?.createdOn).format('DD/MM/YYYY') ?? '-',
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.createdBy?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBulkAttendance>) => (
      <TablePersonAvatar person={data?.createdBy?.person ?? undefined} />
    ),
  },
];

export default function BulkAttendance() {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();
  const [initialModalState, setInitialModalState] = useState<boolean>(false);

  const { data: bulkAttendance } = useBulkAttendance({});

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  const handleAddBulkAttendance = () => {
    setInitialModalState(true);
  };

  const handleCloseModal = () => {
    setInitialModalState(false);
  };

  return (
    <PageContainer title={t('attendance:bulkAttendance')}>
      <PageHeading
        title={t('attendance:bulkAttendance')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => handleAddBulkAttendance()}
              startIcon={<AddIcon />}
            >
              {t('attendance:createBulkAttendance')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={bulkAttendance ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.id)}
      />

      <BulkAttendanceModal
        initialModalState={initialModalState}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
}
