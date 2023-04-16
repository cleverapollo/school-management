import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableAvatar,
  displayName,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { UseQueryReturnType } from '@tyro/api';
import { useBulkUpdateCoreStudent, useStudents } from '../../api/students';

type ReturnTypeFromUseStudents = UseQueryReturnType<typeof useStudents>[number];

const getStudentColumns = (
  translate: TFunction<
    ('common' | 'people')[],
    undefined,
    ('common' | 'people')[]
  >
): GridOptions<ReturnTypeFromUseStudents>['columnDefs'] => [
  {
    field: 'person',
    headerName: translate('common:name'),
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
    field: 'classGroup.name',
    headerName: translate('people:class'),
    enableRowGroup: true,
  },
  {
    field: 'yearGroups',
    headerName: translate('common:year'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data && data.yearGroups.length > 0) {
        return data.yearGroups[0].name;
      }
    },
  },
  {
    field: 'tutors',
    headerName: translate('common:tutor'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data && data.tutors.length > 0) {
        return data.tutors.map((tutor) => displayName(tutor)).join(', ');
      }
    },
  },
  {
    field: 'yearGroupLeads',
    headerName: translate('common:yearhead'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data && data.yearGroupLeads.length > 0) {
        return data.yearGroupLeads
          .map((yearGroupLead) => displayName(yearGroupLead))
          .join(', ');
      }
    },
  },
  {
    field: 'programmeStage',
    headerName: translate('common:programme'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data?.programmeStages && data.programmeStages.length > 0) {
        return data.programmeStages[0]?.programme?.name;
      }
    },
  },
  {
    field: 'studentIrePP.examNumber',
    headerName: translate('people:personal.enrolmentHistory.examNumber'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.preferredFirstName',
    headerName: translate('common:preferredFirstName'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: translate('common:phone'),
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
    headerName: translate('common:email'),
    editable: true,
    hide: true,
    cellEditor: 'agEmailCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.primaryEmail.email', newValue);
      return true;
    },
  },
];

export default function StudentsListPage() {
  const { t } = useTranslation(['common', 'people']);
  const { data: students, isLoading } = useStudents();
  const { mutateAsync: bulkSaveStudents } = useBulkUpdateCoreStudent();

  const studentColumns = useMemo(() => getStudentColumns(t), [t]);

  if (isLoading) {
    return null;
  }

  return (
    <Page title={t('common:students')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('common:students')}
        </Typography>
        <Table
          rowData={students ?? []}
          columnDefs={studentColumns}
          rowSelection="multiple"
          rowHeight={56}
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={bulkSaveStudents}
        />
      </Container>
    </Page>
  );
}
