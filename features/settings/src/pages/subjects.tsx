/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import { Subject } from '@tyro/api';
import { Page } from '@tyro/core';
import Table from '../../../../src/components/table/Table';
import { TableColumn } from '../../../../src/components/table/types';
import { useCatalogueSubjects } from '../api/subjects';

const getColumns = (
  translate: TFunction<('common' | 'subjects')[], undefined, ('common' | 'subjects')[]>
): TableColumn<Subject>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('subjects:shortCode'),
    fieldName: 'shortCode',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('common:colour'),
    fieldName: 'colour',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('common:icon'),
    fieldName: 'icon',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('subjects:nationalCode'),
    fieldName: 'nationalCode',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('common:description'),
    fieldName: 'description',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('subjects:subjectType'),
    fieldName: 'subjectSource',
    filter: 'suggest',
  },
];

export default function Subjects() {
  const { t } = useTranslation(['common', 'subjects']);
  const { data, isLoading } = useCatalogueSubjects();

  const columns = useMemo(() => getColumns(t), [t]);

  const subjects: Subject[] = data as Subject[];
  return (
    <Page title={t('subjects:subject')} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('subjects:subjects')}
        </Typography>
        {subjects && <Table data={subjects} columns={columns} />}
      </Container>
    </Page>
  );
}
