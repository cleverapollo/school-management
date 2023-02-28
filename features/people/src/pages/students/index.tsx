/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { GridOptions, ICellRendererParams, Page, Table } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { useBulkUpdateCoreStudent, useStudents } from '../../api/students';
import { TableAvatar } from '../../components/common/table-avatar';
import { displayName } from '../../../../../src/utils/nameUtils';

type ReturnTypeFromUseStudents = NonNullable<
  ReturnType<typeof useStudents>['data']
>[number];

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
    }: ICellRendererParams<ReturnTypeFromUseStudents, any>) => {
      const person = data?.person;
      const name = displayName(person);

      return (
        <TableAvatar
          name={name}
          avatarUrl={person?.avatarUrl}
          to={`./${data?.partyId ?? ''}`}
        />
      );
    },
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
  {
    field: 'classGroup.name',
    headerName: translate('people:class'),
  },
  {
    field: 'yearGroups',
    headerName: translate('common:year'),
    valueGetter: ({ data }) => {
      if (data && data.yearGroups.length > 0) {
        return data.yearGroups[0].name;
      }
    },
  },
  {
    field: 'tutors',
    headerName: translate('common:tutor'),
    valueGetter: ({ data }) => {
      if (data && data.tutors.length > 0) {
        return data.tutors.map((tutor) => displayName(tutor)).join(', ');
      }
    },
  },
  {
    field: 'yearGroupLeads',
    headerName: translate('common:yearhead'),
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
    <Page title={t('people:students')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('people:students')}
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
