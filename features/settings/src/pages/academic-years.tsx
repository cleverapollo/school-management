import { Box, Button } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  TableBooleanValue,
  Table,
  ActionMenu,
  ConfirmDialog,
  useDebouncedValue,
  PageHeading,
  PageContainer,
  commonActionMenuProps,
} from '@tyro/core';
import {
  useCoreAcademicNamespace,
  ReturnTypeFromUseCoreAcademicNamespace,
} from '@tyro/api';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useCoreSetActiveActiveAcademicNamespace } from '../api/academic-namespaces/change-active-academic-namespace';
import {
  EditAcademicYearModal,
  EditAcademicYearViewProps,
} from '../components/edit-academic-year-modal';
import { changeAcademicNamespace } from '../utils/change-academic-namespace';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>,
  setSelectedNamespace: (
    data: ReturnTypeFromUseCoreAcademicNamespace,
    active: boolean
  ) => void
): GridOptions<ReturnTypeFromUseCoreAcademicNamespace>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    sort: 'desc',
  },
  {
    headerName: t('common:year'),
    field: 'year',
    enableRowGroup: true,
  },
  {
    headerName: t('common:startDate'),
    field: 'startDate',
    valueGetter: ({ data }) =>
      data && data.startDate ? dayjs(data.startDate).format('ll') : '-',
  },
  {
    headerName: t('common:endDate'),
    field: 'endDate',
    valueGetter: ({ data }) =>
      data && data.endDate ? dayjs(data.endDate).format('ll') : '-',
  },
  {
    headerName: t('common:description'),
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
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCoreAcademicNamespace>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:editAcademicYear'),
              onClick: () => setSelectedNamespace(data, false),
            },
            {
              label: t('settings:actions.changeAcademicYear'),
              onClick: () => changeAcademicNamespace(data),
            },
            {
              label: t('settings:actions.makeActive'),
              onClick: () => setSelectedNamespace(data, true),
            },
          ]}
        />
      ),
  },
];

export default function AcademicNamespaceList() {
  const { t } = useTranslation(['common', 'settings', 'navigation']);
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

  const [editAcademicYearInitialState, setEditAcademicYearInitialState] =
    useState<EditAcademicYearViewProps['initialAcademicYearState']>();

  const handleCreateAcademicYear = () => {
    setEditAcademicYearInitialState(
      {} as EditAcademicYearViewProps['initialAcademicYearState']
    );
  };

  const handleCloseModal = () => {
    setEditAcademicYearInitialState(undefined);
    setSelectedNamespace(null);
  };

  const columns = useMemo(
    () =>
      getColumns(t, (data, isActive) => {
        if (isActive) {
          setSelectedNamespace(data);
        } else {
          setEditAcademicYearInitialState({
            ...data,
            id: data?.academicNamespaceId,
            startDate: dayjs(data.startDate),
            endDate: dayjs(data?.endDate),
          });
        }
      }),
    [t, setSelectedNamespace, setEditAcademicYearInitialState]
  );

  return (
    <PageContainer title={t('navigation:management.settings.academicYears')}>
      <PageHeading
        title={t('navigation:management.settings.academicYears')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateAcademicYear}
              startIcon={<AddIcon />}
            >
              {t('settings:createAcademicYear')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={namespaces ?? []}
        columnDefs={columns}
        rowSelection="single"
        getRowId={({ data }) => String(data?.academicNamespaceId)}
      />
      <ConfirmDialog
        open={!!selectedNamespace}
        title={t('settings:namespacesDialog.title', {
          name: selectedRow?.name,
        })}
        description={t('settings:namespacesDialog.description', {
          name: selectedRow?.name,
        })}
        confirmText={t('settings:namespacesDialog.confirmation', {
          name: selectedRow?.name,
        })}
        onClose={handleCloseModal}
        onConfirm={() => {
          if (selectedNamespace) {
            setActiveNamespace(selectedNamespace);
          }
        }}
      />
      <EditAcademicYearModal
        academicYears={namespaces ?? []}
        initialAcademicYearState={editAcademicYearInitialState}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
}
