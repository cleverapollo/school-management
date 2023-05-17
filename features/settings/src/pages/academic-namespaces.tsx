import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  TableBooleanValue,
  Table,
  ActionMenu,
  ConfirmDialog,
  useDisclosure,
  useDebouncedValue,
} from '@tyro/core';
import {
  useCoreAcademicNamespace,
  ReturnTypeFromUseCoreAcademicNamespace,
} from '@tyro/api';
import { VerticalDotsIcon } from '@tyro/icons';
import { useCoreSetActiveActiveAcademicNamespace } from '../api/academic-namespaces/change-active-academic-namespace';

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>,
  setSelectedNamespace: Dispatch<
    SetStateAction<ReturnTypeFromUseCoreAcademicNamespace | null>
  >
): GridOptions<ReturnTypeFromUseCoreAcademicNamespace>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    editable: true,
    sort: 'desc',
  },
  {
    headerName: t('common:year'),
    field: 'year',
    enableRowGroup: true,
  },
  {
    headerName: t('common:type'),
    field: 'type',
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data ? t(`settings:academicNamespaceType.${data.type}`) : '-',
  },
  {
    headerName: t('common:description'),
    editable: true,
    field: 'description',
  },
  {
    headerName: t('settings:active'),
    field: 'isActiveDefaultNamespace',
    valueGetter: ({ data }) =>
      data?.isActiveDefaultNamespace ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCoreAcademicNamespace, any>) =>
      data && (
        <TableBooleanValue value={data?.isActiveDefaultNamespace ?? false} />
      ),
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCoreAcademicNamespace>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:actions.makeActive'),
              onClick: () => setSelectedNamespace(data),
            },
          ]}
        />
      ),
  },
];

export default function AcademicNamespaceList() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: namespaces } = useCoreAcademicNamespace();
  const { mutateAsync: setActiveNamespace } =
    useCoreSetActiveActiveAcademicNamespace();
  const {
    value: selectedNamespace,
    debouncedValue: debouncedSelectedNamespace,
    setValue: setSelectedNamespace,
  } = useDebouncedValue<ReturnTypeFromUseCoreAcademicNamespace | null>({
    defaultValue: null,
  });

  const selectedRow = selectedNamespace ?? debouncedSelectedNamespace;

  const columns = useMemo(
    () => getColumns(t, setSelectedNamespace),
    [t, setSelectedNamespace]
  );

  return (
    <>
      <Page title={t('settings:namespaces')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('settings:namespaces')}
          </Typography>
          <Table
            rowData={namespaces ?? []}
            columnDefs={columns}
            rowSelection="single"
            getRowId={({ data }) => String(data?.academicNamespaceId)}
          />
        </Container>
      </Page>
      <ConfirmDialog
        open={!!selectedNamespace}
        title={t('settings:namespacesDialog.title', {
          year: selectedRow?.year,
        })}
        description={t('settings:namespacesDialog.description')}
        confirmText={t('settings:namespacesDialog.confirmation', {
          year: selectedRow?.year,
        })}
        onClose={() => setSelectedNamespace(null)}
        onConfirm={() => {
          if (selectedNamespace) {
            setActiveNamespace(selectedNamespace);
          }
        }}
      />
    </>
  );
}
