import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import { GridOptions, Page, Table } from '@tyro/core';
import { useCatalogueSubjects } from '../api/subjects';

type ReturnTypeFromUseCatalogueSubjects = NonNullable<
  ReturnType<typeof useCatalogueSubjects>['data']
>[number];

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseCatalogueSubjects>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    sort: 'asc',
  },
  {
    headerName: t('settings:shortCode'),
    field: 'shortCode',
  },
  {
    headerName: t('common:colour'),
    field: 'colour',
  },
  {
    headerName: t('common:icon'),
    field: 'icon',
  },
  {
    headerName: t('settings:nationalCode'),
    field: 'nationalCode',
  },
  {
    headerName: t('common:description'),
    field: 'description',
  },
  {
    headerName: t('settings:subjectType'),
    field: 'subjectSource',
    valueGetter: ({ data }) =>
      data ? t(`settings:subjectSource.${data.subjectSource}`) : null,
  },
];

export default function Subjects() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: subjects } = useCatalogueSubjects();

  const columns = useMemo(() => getColumns(t), [t]);

  return (
    <Page title={t('settings:subjects')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('settings:subjects')}
        </Typography>
        <Table
          rowData={subjects ?? []}
          columnDefs={columns}
          getRowId={({ data }) => String(data?.id)}
        />
      </Container>
    </Page>
  );
}
