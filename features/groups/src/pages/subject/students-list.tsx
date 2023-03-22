/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Person, SubjectGroup } from '@tyro/api';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Page } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { TableColumn } from '../../../../../src/components/table/types';

import { displayName } from '../../../../../src/utils/nameUtils';
import { useStudentSubjects } from '../../api/student-subjects';
import { SubjectGroupLevelChip } from '../../components';

interface SubjectsData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const getSubjectColumns = (
  translate: TFunction<
    ('common' | 'groups')[],
    undefined,
    ('common' | 'groups')[]
  >
): TableColumn<SubjectsData>[] => [
  {
    columnDisplayName: translate('common:subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    isMandatory: true,
    component: ({ row }) => {
      const subject = row.original.subjects?.find(() => true);
      return subject?.name;
    },
  },
  {
    columnDisplayName: translate('common:level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: (columnProps) =>
      columnProps.row.original.irePP?.level ? (
        <SubjectGroupLevelChip level={columnProps.row.original.irePP.level} />
      ) : null,
  },
  {
    columnDisplayName: translate('common:teacher'),
    fieldName: 'staff',
    filter: 'suggest',
    component: ({ row }) => {
      const teachers = row.original.staff as Person[];
      if (teachers.length === 0) return '-';

      return teachers.map(displayName).join(',');
    },
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: (columnProps) => (
      <Button onClick={() => {}}>{columnProps.row.original.firstButton}</Button>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
];

// TODO: migrate to react-data-grid

export default function Subjects() {
  const { t } = useTranslation(['common', 'groups']);
  const { data, isLoading } = useStudentSubjects();

  const subjectsData: SubjectsData[] =
    data?.map(
      (group) =>
        (({
          ...group,
          firstButton: t('common:actions.view'),
          tech: '',
        } as SubjectsData) || [])
    ) || [];

  const subjectGroupColumns = useMemo(() => getSubjectColumns(t), [t]);

  return (
    <Page title={t('common:subject')} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('common:subject')}
        </Typography>
        <Table data={subjectsData} columns={subjectGroupColumns} />
      </Container>
    </Page>
  );
}
