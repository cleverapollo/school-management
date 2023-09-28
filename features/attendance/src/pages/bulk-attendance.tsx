import { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { AddIcon } from '@tyro/icons';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  useDebouncedValue,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  BulkAttendanceModal,
  BulkAttendanceModalProps,
} from '../components/bulk-attendance/index';
import {
  useBulkAttendance,
  ReturnTypeFromUseBulkAttendance,
} from '../api/bulk-attendance/bulk-attendance';

dayjs.extend(LocalizedFormat);

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
        if (party?.__typename === 'GeneralGroup') {
          return party?.name;
        }
        return null;
      }),
  },
  {
    field: 'attendanceCode.name',
    headerName: t('common:attendance'),
    valueGetter: ({ data }) => data?.attendanceCode?.name ?? '-',
  },
  {
    field: 'startDate',
    headerName: t('common:date'),
    valueGetter: ({ data }) => {
      const startDate = dayjs(data?.startDate).format('DD/MM/YYYY');
      const endDate = data?.endDate
        ? dayjs(data?.endDate).format('DD/MM/YYYY')
        : null;
      const fullDayOrMultiDay = endDate
        ? `${startDate} - ${endDate}`
        : startDate;
      const partialDay = `${dayjs(data?.startDate).format('DD/MM/YYYY')} from ${
        data?.leavesAt ?? '-'
      } to ${data?.returnsAt ?? '-'}`;
      const date = data?.leavesAt ? partialDay : fullDayOrMultiDay;
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

  const {
    value: bulkAttendanceDetails,
    debouncedValue: debouncedAttendanceDetails,
    setValue: setBulkAttendanceDetails,
  } = useDebouncedValue<BulkAttendanceModalProps['initialModalState']>({
    defaultValue: null,
  });

  const { data: bulkAttendance } = useBulkAttendance({});

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  return (
    <PageContainer title={t('attendance:bulkAttendance')}>
      <PageHeading
        title={t('attendance:bulkAttendance')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => setBulkAttendanceDetails({})}
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
        open={!!bulkAttendanceDetails}
        onClose={() => setBulkAttendanceDetails(null)}
        initialModalState={bulkAttendanceDetails || debouncedAttendanceDetails}
      />
    </PageContainer>
  );
}
