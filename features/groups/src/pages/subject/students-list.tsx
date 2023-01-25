/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Person, SubjectGroup } from '@tyro/api';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Page } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { TableColumn } from '../../../../../src/components/table/types';
import { ColoredBox } from '../../components/ColoredBox';
import { MultiPersonsAvatars } from '../../components/MultiPersonsAvatars';
import { useStudentSubjects } from '../../api/student-subjects';

interface SubjectsData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const getSubjectColumns = (
  translate: TFunction<
    ('common' | 'authentication')[],
    undefined,
    ('common' | 'authentication')[]
  >
): TableColumn<SubjectsData>[] => [
  {
    columnDisplayName: translate('authentication:subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    isMandatory: true,
    component: ({ row }) => {
      const subject = row.original.subjects?.find(() => true);
      return subject?.name;
    },
  },
  {
    columnDisplayName: translate('authentication:level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: (columnProps) => (
      <ColoredBox
        content={columnProps.row.original.irePP?.level ?? undefined}
      />
    ),
  },
  {
    columnDisplayName: translate('common:teacher'),
    fieldName: 'staff',
    filter: 'suggest',
    component: ({ row }) => {
      const teachers = row.original.staff as [Person];
      return <MultiPersonsAvatars person={teachers} />;
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

export default function Subjects() {
  const { t } = useTranslation(['common', 'authentication']);
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
    <Page title="Subject" isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Subject
        </Typography>
        <Table data={subjectsData} columns={subjectGroupColumns} />
      </Container>
    </Page>
  );
}
