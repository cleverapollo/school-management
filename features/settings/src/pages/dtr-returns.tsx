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
  TableSwitch,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DownloadArrowCircleIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { FormTypeDropdown } from '../components/dtr-returns/form-type-dropdown';
import {
  ReturnTypeFromUseFormB,
  useFormB,
} from '../api/dtr-returns/user-form-b';

dayjs.extend(LocalizedFormat);

const getColumnFormBDefs = (
  translate: TFunction<
    ('settings' | 'people' | 'common')[],
    undefined,
    ('settings' | 'people' | 'common')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseFormB>['columnDefs'] => [
  {
    field: 'includeInDtrReturn',
    headerName: translate('settings:dtrReturns.formB.includeInDTR'),
    valueFormatter: ({ data }) => translate('common:yes'),
    cellEditor: TableSwitch,
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value />
    ),
  },
  {
    field: 'name',
    headerName: translate('common:name'),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFormB>) =>
      data && <RouterLink to="./">{displayName(data.person)}</RouterLink>,
  },
  {
    field: 'dtrReference',
    headerName: translate('settings:dtrReturns.formB.dtrReference'),
    valueGetter: ({ data }) => data?.staffIre?.teacherReferenceNumber ?? null,
  },
  {
    field: 'gender',
    headerName: translate('settings:dtrReturns.formB.gender'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? translate(`people:gender.${data?.personalInformation?.gender}`)
        : translate('people:gender.UNKNOWN'),
  },
  {
    field: 'ppsNumber',
    headerName: translate('settings:dtrReturns.formB.ppsNumber'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.ire?.ppsNumber ?? null,
  },
  {
    field: 'payrollNumber',
    headerName: translate('settings:dtrReturns.formB.payrollNumber'),
    valueGetter: ({ data }) => data?.payrollNumber ?? '-',
  },
  {
    field: 'post',
    headerName: translate('settings:dtrReturns.formB.post'),
    valueGetter: ({ data }) => data?.staffIre?.staffPost?.name ?? '-',
  },
  {
    field: 'capacity',
    headerName: translate('settings:capacity'),
    valueGetter: ({ data }) => data?.employmentCapacity?.name ?? null,
  },
  {
    field: 'jobSharer',
    headerName: translate('settings:dtrReturns.formB.jobSharer'),
    valueGetter: ({ data }) => Boolean(data?.jobSharing),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.jobSharing)} />
    ),
  },
  {
    field: 'qualification1',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 1 }),
    valueGetter: ({ data }) => data?.qualifications ?? '-',
  },
  {
    field: 'qualification2',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 2 }),
    valueGetter: ({ data }) => data?.staffIre?.qualifications2 ?? '-',
  },
  {
    field: 'qualification3',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 3 }),
    valueGetter: ({ data }) => data?.staffIre?.qualifications3 ?? '-',
  },
  {
    field: 'qualification4',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 4 }),
    valueGetter: ({ data }) => data?.staffIre?.qualifications4 ?? '-',
  },
  {
    field: 'currentTeachingSchool1',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      X: 1,
    }),
    valueGetter: ({ data }) => data?.staffIre?.otherSchool1 ?? '-',
  },
  {
    field: 'currentTeachingSchool2',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      X: 2,
    }),
    valueGetter: ({ data }) => data?.staffIre?.otherSchool2 ?? '-',
  },
  {
    field: 'previousTeachingSchool1',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 1,
    }),
    valueGetter: ({ data }) => data?.staffIre?.previousSchool1 ?? '-',
  },
  {
    field: 'previousTeachingSchool2',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 2,
    }),
    valueGetter: ({ data }) => data?.staffIre?.previousSchool2 ?? '-',
  },
];

export default function DTRReturnsPage() {
  const { t } = useTranslation(['navigation', 'settings', 'people', 'common']);

  const { displayName } = usePreferredNameLayout();

  const [formTypeId, setFormTypeId] = useState<number>(2);

  const { data: staffFormB = [] } = useFormB({});

  const columnDefs = useMemo(() => {
    switch (formTypeId) {
      case 1:
        break;
      case 2:
        return getColumnFormBDefs(t, displayName);
      default:
        return null;
    }
  }, [t, displayName, formTypeId]);

  const dataForTable = useMemo(() => {
    switch (formTypeId) {
      case 1:
        break;
      case 2:
        return staffFormB;
      default:
        return [];
    }
  }, [formTypeId, staffFormB]);

  return (
    <PageContainer title={t('navigation:management.settings.dtrReturns')}>
      <PageHeading
        title={t('navigation:management.settings.dtrReturns')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => {}}
              startIcon={<DownloadArrowCircleIcon />}
            >
              {t('settings:dtrReturns.downloadFile')}
            </Button>
          </Box>
        }
      />
      <FormTypeDropdown
        formTypeId={formTypeId}
        onChangeFormType={setFormTypeId}
      />
      <Table
        rowData={dataForTable || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.partyId)}
      />
    </PageContainer>
  );
}
