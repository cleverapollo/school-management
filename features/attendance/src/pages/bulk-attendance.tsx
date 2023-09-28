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
    colId: 'name',
    headerName: t('common:name'),
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
        return '-';
      }),
  },
  {
    field: 'attendanceCode.name',
    headerName: t('common:attendance'),
    valueGetter: ({ data }) => data?.attendanceCode?.name || '-',
  },
  {
    field: 'startDate',
    headerName: t('common:date'),
    valueGetter: ({ data }) => {
      const { startDate, endDate, leavesAt, returnsAt } = data || {};

      const startDateFormat = dayjs(startDate).format('L');
      const endDateFormat = endDate ? dayjs(endDate).format('L') : null;

      const fullDayOrMultiDay = endDateFormat
        ? t('attendance:dayTypeOptionsFormatted.MULTI_DAY', {
            startDate: startDateFormat,
            endDate: endDateFormat,
          })
        : t('attendance:dayTypeOptionsFormatted.SINGLE_DAY', {
            startDate: startDateFormat,
          });

      const partialDay = t('attendance:dayTypeOptionsFormatted.PARTIAL_DAY', {
        startDate: startDateFormat,
        enDate: endDateFormat,
        startTime: leavesAt,
        endTime: returnsAt,
      });

      return leavesAt ? partialDay : fullDayOrMultiDay;
    },
  },
  {
    field: 'note',
    headerName: t('common:note'),
    valueGetter: ({ data }) => data?.note || '-',
  },
  {
    field: 'createdOn',
    headerName: t('attendance:createdOn'),
    valueFormatter: ({ data }) => dayjs(data?.createdOn).format('L') || '-',
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
