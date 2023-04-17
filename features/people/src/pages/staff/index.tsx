import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  ReturnTypeDisplayName,
  TableAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { UseQueryReturnType } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStaff } from '../../api/staff';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseStudents = UseQueryReturnType<typeof useStaff>[number];

const getStaffColumns = (
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseStudents>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudents, any>) => (
      <TableAvatar person={data?.person} to={`./${data?.partyId ?? ''}`} />
    ),
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
  {
    field: 'staffIreTeacher.teachingPost',
    headerName: t('people:position'),
  },
  {
    field: 'employmentCapacity',
    headerName: t('common:capacity'),
    valueGetter: ({ data }) =>
      data && data.employmentCapacity
        ? t(`people:employmentCapacity.${data.employmentCapacity}`)
        : t(`people:employmentCapacity.UNKNOWN`),
  },
  {
    field: 'carRegistrationNumber',
    headerName: t('people:carRegistation'),
  },
  {
    field: 'startDate',
    headerName: t('common:startDate'),
    valueGetter: ({ data }) =>
      data && data.startDate ? dayjs(data.startDate).format('ll') : '-',
  },
  {
    field: 'endDate',
    headerName: t('common:endDate'),
    valueGetter: ({ data }) =>
      data && data.endDate ? dayjs(data.endDate).format('ll') : '-',
  },
  {
    field: 'staffIre.pps',
    headerName: t('people:ppsNumber'),
  },
  {
    field: 'personalInformation.gender',
    headerName: t('people:gender.title'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? t(`people:gender.${data?.personalInformation?.gender}`)
        : t('people:gender.UNKNOWN'),
  },
  {
    field: 'staffIreTeacher.teacherCouncilNumber',
    headerName: t('people:teacherCouncilNumber'),
  },
  {
    field: 'personalInformation.preferredFirstName',
    headerName: t('common:preferredFirstName'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: t('common:phone'),
    editable: true,
    hide: true,
    cellEditor: 'agNumericCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(
        data ?? {},
        'personalInformation.primaryPhoneNumber.number',
        newValue
      );
      return true;
    },
  },
  {
    field: 'personalInformation.primaryEmail.email',
    headerName: t('common:email'),
    editable: true,
    hide: true,
    cellEditor: 'agEmailCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.primaryEmail.email', newValue);
      return true;
    },
  },
];

export default function StaffListPage() {
  const { t } = useTranslation(['common', 'people']);
  const { data: staff, isLoading } = useStaff({});
  const { displayName } = usePreferredNameLayout();

  const staffColumns = useMemo(
    () => getStaffColumns(t, displayName),
    [t, displayName]
  );

  if (isLoading) {
    return null;
  }

  return (
    <Page title={t('common:staff')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('common:staff')}
        </Typography>
        <Table
          rowData={staff ?? []}
          columnDefs={staffColumns}
          rowSelection="multiple"
          rowHeight={56}
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={async () => {}}
        />
      </Container>
    </Page>
  );
}
