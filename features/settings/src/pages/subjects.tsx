/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import { Subject } from '@tyro/api';
import Page from '../../../../src/components/Page';
import useSettings from '../../../../src/hooks/useSettings';
import Table from '../../../../src/components/table/Table';
import { TableColumn } from '../../../../src/components/table/types';
import { useCatalogueSubjects } from '../api/subjects';

const getColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>
): TableColumn<Subject>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('common:shortCode'),
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
    columnDisplayName: translate('common:nationalCode'),
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
    columnDisplayName: translate('common:subjectType'),
    fieldName: 'subjectSource',
    filter: 'suggest',
  },
];

export default function Subjects() {
  const { t } = useTranslation(['common']);
  const { themeStretch } = useSettings();
  const { data, isLoading } = useCatalogueSubjects();

  const columns = useMemo(() => getColumns(t), [t]);

  const subjects: Subject[] = data as Subject[];
  return (
    <Page title="Subject" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subjects
        </Typography>
        {subjects && <Table data={subjects} columns={columns} />}
      </Container>
    </Page>
  );
}
