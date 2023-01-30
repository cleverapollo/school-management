/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useMemo } from 'react';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Student } from '@tyro/api';
import { Page } from '@tyro/core';
import { useStudents } from '../../api/students';
import { TableColumn } from '../../../../../src/components/table/types';
import Table from '../../../../../src/components/table/Table';

interface TableData extends Student {
  firstButton: string;
}

const getStudentColumns = (
  translate: TFunction<
    ('authentication' | 'common')[],
    undefined,
    ('authentication' | 'common')[]
  >,
  navigate: NavigateFunction
): TableColumn<TableData>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'person.firstName',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => {
      const { person } = columnProps.row.original;
      const name = `${person?.firstName ?? ''} ${person?.lastName ?? ''}`;

      return (
        <Box display="flex" alignItems="center">
          <Avatar
            src={person?.avatarUrl ?? undefined}
            alt={name}
            sx={{
              mr: 1.5,
            }}
          />
          {name}
        </Box>
      );
    },
  },
  {
    columnDisplayName: translate('common:classGroup'),
    fieldName: 'classGroup.name',
    component: ({ row }) => {
      const { classGroup } = row.original;
      return classGroup?.name ?? '';
    },
    filter: 'suggest',
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: ({ row }) => (
      <Button
        onClick={() => {
          navigate(`./${row.original.partyId ?? ''}`);
        }}
      >
        {translate('common:actions.view')}
      </Button>
    ),
  },
];

export default function StudentsListPage() {
  const { t } = useTranslation(['authentication']);
  const navigate = useNavigate();
  const { data, isLoading } = useStudents();
  const students = data as TableData[];

  const studentColumns = useMemo(
    () => getStudentColumns(t, navigate),
    [t, navigate]
  );

  if (isLoading) {
    return null;
  }

  return (
    <Page title="People">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Students
        </Typography>
        <Table data={students ?? []} columns={studentColumns} />
      </Container>
    </Page>
  );
}
