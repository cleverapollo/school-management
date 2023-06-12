import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  ReturnTypeDisplayName,
  GridOptions,
  usePreferredNameLayout,
} from '@tyro/core';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddIcon } from '@tyro/icons';
import { UseQueryReturnType } from '@tyro/api';
import { useMemo } from 'react';
import { useAttendanceCodes } from '../api';

type ReturnTypeFromUseAttendanceCodes = UseQueryReturnType<
  typeof useAttendanceCodes
>[number];

const getAttendanceCodeColumns = (
  t: TFunction<
    ('common' | 'attendance')[],
    undefined,
    ('attendance' | 'attendance')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseAttendanceCodes>['columnDefs'] => [
  {
    field: 'code',
    headerName: t('attendance:code'),
    sort: 'asc',
    lockVisible: true,
  },
  {
    field: 'description',
    headerName: t('common:description'),
  },
  {
    field: 'reportAs',
    headerName: t('attendance:reportAs'),
  },
  {
    field: 'tuslaCode',
    headerName: t('attendance:tuslaCode'),
  },
  {
    field: 'availableTo',
    headerName: t('attendance:availableTo'),
  },
];

export default function AttendanceCodes() {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();
  const { data: attendanceCodes } = useAttendanceCodes({});

  const attendanceCodeColumns = useMemo(
    () => getAttendanceCodeColumns(t, displayName),
    [t, displayName]
  );

  return (
    <Table
      rowData={attendanceCodes ?? []}
      columnDefs={attendanceCodeColumns}
      rowSelection="multiple"
      getRowId={({ data }) => String(data?.id)}
      onBulkSave={async () => {}}
      rightAdornment={
        <Fade in unmountOnExit>
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="./create"
              startIcon={<AddIcon />}
            >
              {t('attendance:createAttendanceCode')}
            </Button>
          </Box>
        </Fade>
      }
      onRowSelection={(newSelectedStaff) => {}}
    />
  );
}
