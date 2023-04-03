import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  displayName,
  TableAvatar,
} from '@tyro/core';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useStaffWorkAbsences } from '../api';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseStaffWorkAbsences = NonNullable<
  ReturnType<typeof useStaffWorkAbsences>['data']
>[number];

const getColumnDefs = (
  translate: TFunction<'substitution'[], undefined, 'substitution'[]>
): GridOptions<ReturnTypeFromUseStaffWorkAbsences>['columnDefs'] => [
  {
    field: 'staff',
    headerName: translate('substitution:absentStaff'),
    valueGetter: ({ data }) => displayName(data?.staff ?? undefined),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences>) => (
      <TableAvatar
        person={data?.staff ?? undefined}
        // TODO: add route to absence id
        to={`./${data?.absenceId ?? ''}`}
      />
    ),
  },
  {
    field: 'absenceType',
    // TODO: add reason text check if it can be added to the scheme
    headerName: translate('substitution:reason'),
    valueGetter: ({ data }) => data?.absenceType.name,
  },
  {
    field: 'fromDate',
    headerName: translate('substitution:startDate'),
    // TODO: check if this should be DateTime
    valueGetter: ({ data }) => dayjs(data?.fromDate).format('LL'),
  },
  {
    field: 'toDate',
    headerName: translate('substitution:endDate'),
    // TODO: check if this should be DateTime
    valueGetter: ({ data }) => dayjs(data?.toDate).format('LL'),
  },
  // TODO: check how can map these values
  {
    field: 'substitute',
    headerName: translate('substitution:substitute'),
  },
  {
    field: 'payroll',
    headerName: translate('substitution:payroll'),
  },
];

export default function AbsentStaffPage() {
  const { t } = useTranslation(['substitution']);
  const navigate = useNavigate();

  const { data: absencesData } = useStaffWorkAbsences({});
  const columnDefs = getColumnDefs(t);

  return (
    <>
      <Typography variant="h3" component="h1">
        {t('substitution:management')}
      </Typography>
      <Table
        rowData={absencesData || []}
        columnDefs={columnDefs}
        rowSelection="multiple"
        getRowId={({ data }) => String(data.absenceId)}
        rightAdornment={
          <Button
            variant="contained"
            onClick={() => navigate('./create-staff-absence')}
          >
            {t('substitution:createStaffAbsence')}
          </Button>
        }
      />
    </>
  );
}
