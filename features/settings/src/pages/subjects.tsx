import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableColorPicker,
  TableSelectedColor,
} from '@tyro/core';
import {
  ColorOptions,
  Colour,
  UpsertSubject,
  UseQueryReturnType,
} from '@tyro/api';
import {
  useCatalogueSubjects,
  useUpdateCatalogueSubjects,
} from '../api/subjects';

type ReturnTypeFromUseCatalogueSubjects = UseQueryReturnType<
  typeof useCatalogueSubjects
>[number];

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseCatalogueSubjects>['columnDefs'] => [
  {
    headerName: t('settings:nationalCode'),
    field: 'nationalCode',
    sort: 'asc',
    comparator: (valueA, valueB) => valueA - valueB,
  },
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
  },
  {
    headerName: t('settings:shortCode'),
    field: 'shortCode',
  },
  {
    headerName: t('common:colour'),
    field: 'colour',
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCatalogueSubjects, any>) =>
      data ? <TableSelectedColor value={data?.colour} /> : null,
    cellEditorSelector: () => ({
      component: TableColorPicker,
      popup: true,
      popupPosition: 'under',
    }),
    valueSetter: ({ newValue, data }) => {
      const valueAsLowercase =
        typeof newValue === 'string' ? newValue.toLowerCase() : null;

      if (
        data &&
        valueAsLowercase &&
        ColorOptions.includes(valueAsLowercase as Colour)
      ) {
        data.colour = valueAsLowercase as Colour;
        return true;
      }

      return false;
    },
  },
  {
    headerName: t('common:icon'),
    field: 'icon',
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

  const { mutateAsync: saveSubjects } = useUpdateCatalogueSubjects();

  const bulkSaveSubjects = (
    data: BulkEditedRows<ReturnTypeFromUseCatalogueSubjects, 'colour'>
  ) => {
    const dataForEndpoint = Object.keys(data).map<UpsertSubject>((id) => ({
      subjectId: Number(id),
      colour: data[id].colour?.newValue,
    }));

    return saveSubjects(dataForEndpoint);
  };

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
          onBulkSave={bulkSaveSubjects}
        />
      </Container>
    </Page>
  );
}
