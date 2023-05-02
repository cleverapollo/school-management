import { Button, Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  TableBooleanValue,
  Table,
  ActionMenu,
  ConfirmDialog,
  useDisclosure,
} from '@tyro/core';
import {
  useCoreAcademicNamespace,
  ReturnTypeFromUseCoreAcademicNamespace,
} from '@tyro/api';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { useCoreSetActiveActiveAcademicNamespace } from '../api/academic-namespaces/change-active-academic-namespace';

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>,
  openConfirmDialog: () => void
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
              onClick: openConfirmDialog,
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
  const [selectedNamespace, setSelectedNamespace] =
    useState<ReturnTypeFromUseCoreAcademicNamespace | null>(null);

  const {
    isOpen: isConfirmDialogOpen,
    onClose: closeConfirmDialog,
    onOpen: openConfirmDialog,
  } = useDisclosure();

  const columns = useMemo(
    () => getColumns(t, openConfirmDialog),
    [t, openConfirmDialog]
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
            onRowSelection={(namespace) => {
              const newValue =
                namespace.length > 0 && namespace[0] ? namespace[0] : null;

              setSelectedNamespace(newValue);
            }}
            rightAdornment={
              <Button variant="text" startIcon={<AddIcon />}>
                {t('settings:actions.addNewRoom')}
              </Button>
            }
          />
        </Container>
      </Page>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        title={t('settings:namespacesDialog.title', {
          year: selectedNamespace?.year,
        })}
        description={t('settings:namespacesDialog.description')}
        confirmText={t('settings:namespacesDialog.confirmation', {
          year: selectedNamespace?.year,
        })}
        onClose={closeConfirmDialog}
        onConfirm={() => {
          if (selectedNamespace) {
            setActiveNamespace(selectedNamespace);
          }
        }}
      />
    </>
  );
}
