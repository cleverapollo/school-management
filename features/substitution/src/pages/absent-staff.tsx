import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  TablePersonAvatar,
  PageContainer,
  PageHeading,
  useDebouncedValue,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useMemo } from 'react';
import { AddIcon } from '@tyro/icons';
import { useStaffWorkAbsences } from '../api';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseStaffWorkAbsences = NonNullable<
  ReturnType<typeof useStaffWorkAbsences>['data']
>[number];

const getColumnDefs = (
  translate: TFunction<'substitution'[], undefined, 'substitution'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseStaffWorkAbsences>['columnDefs'] => [
  {
    field: 'staff',
    headerName: translate('substitution:absentStaff'),
    valueGetter: ({ data }) => displayName(data?.staff ?? undefined),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences>) => (
      <TablePersonAvatar
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
  // {
  //   field: 'fromDate',
  //   headerName: translate('substitution:startDate'),
  //   // TODO: check if this should be DateTime
  //   valueGetter: ({ data }) => dayjs(data?.fromDate).format('LL'),
  // },
  // {
  //   field: 'toDate',
  //   headerName: translate('substitution:endDate'),
  //   // TODO: check if this should be DateTime
  //   valueGetter: ({ data }) => dayjs(data?.toDate).format('LL'),
  // },
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
  const { displayName } = usePreferredNameLayout();
  const {
    value: searchValue,
    debouncedValue: debouncedSearchValue,
    setValue: setSearchValue,
  } = useDebouncedValue({ defaultValue: null });

  const { data: absencesData } = useStaffWorkAbsences({});

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

  return (
    <PageContainer title={t('substitution:management')}>
      <PageHeading
        title={t('substitution:management')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="./term-assessments/create"
              startIcon={<AddIcon />}
            >
              {t('substitution:createStaffAbsence')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={absencesData || []}
        columnDefs={columnDefs}
        rowSelection="multiple"
        getRowId={({ data }) => String(data.absenceId)}
      />
    </PageContainer>
  );
}
