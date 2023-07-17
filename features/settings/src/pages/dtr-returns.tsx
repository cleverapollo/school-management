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
  GenderSelectCellEditor,
} from '@tyro/core';
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
    field: 'staffIre.includeDtrReturns',
    headerName: translate('settings:dtrReturns.formB.includeInDTR'),
    valueFormatter: ({ data }) =>
      data?.staffIre?.includeDtrReturns
        ? translate('common:yes')
        : translate('common:no'),
    cellEditor: TableSwitch,
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.staffIre?.includeDtrReturns)} />
    ),
  },
  {
    field: 'name',
    headerName: translate('common:name'),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFormB>) =>
      data && (
        <RouterLink to={`/people/staff/${data.partyId}`}>
          {displayName(data.person)}
        </RouterLink>
      ),
  },
  {
    field: 'staffIre.teacherReferenceNumber',
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    headerName: translate('settings:dtrReturns.formB.dtrReference'),
    valueGetter: ({ data }) => data?.staffIre?.teacherReferenceNumber ?? null,
  },
  {
    field: 'personalInformation.gender',
    headerName: translate('settings:dtrReturns.formB.gender'),
    cellEditorSelector: GenderSelectCellEditor(),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? translate(`people:gender.${data?.personalInformation?.gender}`)
        : translate('people:gender.UNKNOWN'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
  },
  {
    field: 'personalInformation.ire.ppsNumber',
    headerName: translate('settings:dtrReturns.formB.ppsNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) =>
      data?.personalInformation?.ire?.ppsNumber ?? null,
  },
  {
    field: 'payrollNumber',
    headerName: translate('settings:dtrReturns.formB.payrollNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.payrollNumber ?? '-',
  },
  {
    field: 'staffIre.staffPost.name',
    headerName: translate('settings:dtrReturns.formB.post'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.staffPost?.name ?? '-',
  },
  {
    field: 'employmentCapacity.name',
    headerName: translate('settings:capacity'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.employmentCapacity?.name ?? null,
  },
  {
    field: 'jobSharing',
    headerName: translate('settings:dtrReturns.formB.jobSharer'),
    valueGetter: ({ data }) => Boolean(data?.jobSharing),
    cellEditor: TableSwitch,
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.jobSharing)} />
    ),
  },
  {
    field: 'qualifications',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 1 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.qualifications ?? '-',
  },
  {
    field: 'staffIre.qualifications2',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 2 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications2 ?? '-',
  },
  {
    field: 'staffIre.qualifications3',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 3 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications3 ?? '-',
  },
  {
    field: 'staffIre.qualifications4',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 4 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications4 ?? '-',
  },
  {
    field: 'staffIre.otherSchool1',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      X: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.otherSchool1 ?? '-',
  },
  {
    field: 'staffIre.otherSchool2',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      X: 2,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.otherSchool2 ?? '-',
  },
  {
    field: 'staffIre.previousSchool1',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.previousSchool1 ?? '-',
  },
  {
    field: 'staffIre.previousSchool2',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 2,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
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
