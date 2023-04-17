import {
  Box,
  Button,
  Collapse,
  Container,
  Fade,
  Stack,
  Typography,
} from '@mui/material';
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
import { AddIcon } from '@tyro/icons';
import { useCoreSetActiveActiveAcademicNamespace } from '../api/academic-namespaces/change-active-academic-namespace';

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseCoreAcademicNamespace>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    checkboxSelection: true,
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
    }: ICellRendererParams<ReturnTypeFromUseCoreAcademicNamespace, any>) => (
      <TableBooleanValue value={data?.isActiveDefaultNamespace ?? false} />
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
  const showActionMenu = Boolean(selectedNamespace);

  const columns = useMemo(() => getColumns(t), [t]);

  const actionMenuItems = [
    {
      label: t('settings:actions.makeActive'),
      onClick: openConfirmDialog,
    },
  ];

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
            getRowId={({ data }) => String(data?.academicNamespaceId)}
            onRowSelection={(namespace) => {
              const newValue =
                namespace.length > 0 && namespace[0] ? namespace[0] : null;

              setSelectedNamespace(newValue);
            }}
            rightAdornment={
              <Stack direction="row" spacing={1}>
                <Button variant="text" endIcon={<AddIcon />}>
                  {t('settings:actions.addNewRoom')}
                </Button>
                <Collapse
                  in={showActionMenu}
                  orientation="horizontal"
                  unmountOnExit
                >
                  <Fade in={showActionMenu}>
                    <Box>
                      <ActionMenu
                        menuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                          },
                        }}
                        menuItems={actionMenuItems}
                      />
                    </Box>
                  </Fade>
                </Collapse>
              </Stack>
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
