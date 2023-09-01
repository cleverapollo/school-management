import { useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  PageHeading,
  Table,
  PageContainer,
  ICellRendererParams,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { AddIcon, DownloadArrowCircleIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import { useDownloadFile } from '../../api/dtr-returns/download-file';
import { UpsertBehaviourLabelModalProps } from '../../components/upsert-behaviour-label';
import {
  UpsertNonClassContactModal,
  UpsertNonClassContactModalProps,
} from '../../components/dtr-returns/upsert-non-class-contact-modal';

dayjs.extend(LocalizedFormat);

type DtrReturn = {
  id: number;
  name: string;
  description: string;
  textAction: string;
  linkAction?: string;
  clickAction?: () => void;
};

export const fileNames = {
  FileA: 'FILE_A',
  FileB: 'FILE_B',
  FileC: 'FILE_C',
  FileD: 'FILE_D',
  FileE: 'FILE_E',
};

const formTypeOptions = (
  t: TFunction<'settings'[], undefined, 'settings'[]>
) => [
  {
    id: 0,
    name: t('settings:dtrReturns.fileA'),
    description: t('settings:dtrReturns.descriptionA'),
    textAction: t('settings:dtrReturns.downloadFile'),
  },
  {
    id: 1,
    name: t('settings:dtrReturns.fileB'),
    description: t('settings:dtrReturns.descriptionB'),
    textAction: t('settings:dtrReturns.viewFile'),
    linkAction: './file-b',
  },
  {
    id: 2,
    name: t('settings:dtrReturns.fileC'),
    description: t('settings:dtrReturns.descriptionC'),
    textAction: t('settings:dtrReturns.downloadFile'),
  },
  {
    id: 3,
    name: t('settings:dtrReturns.fileD'),
    description: t('settings:dtrReturns.descriptionD'),
    textAction: t('settings:dtrReturns.downloadFile'),
  },
  {
    id: 4,
    name: t('settings:dtrReturns.fileE'),
    description: t('settings:dtrReturns.descriptionE'),
    textAction: t('settings:dtrReturns.downloadFile'),
  },
  {
    id: 5,
    name: t('settings:dtrReturns.dtrSummary'),
    description: t('settings:dtrReturns.descriptionDtrSummary'),
    textAction: t('settings:dtrReturns.downloadFile'),
  },
];

const getColumnDefs = (
  t: TFunction<('settings' | 'common')[], undefined, ('settings' | 'common')[]>,
  downloadFile: (fileName: string) => void,
  isSubmitting: boolean
): GridOptions<DtrReturn>['columnDefs'] => [
  { field: 'id', hide: true },
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    wrapText: true,
    autoHeight: true,
  },
  {
    cellRenderer: ({ data }: ICellRendererParams<DtrReturn, any>) => {
      const fileName = Object.values(fileNames)[data?.id as number];

      return data?.id === 1 ? (
        <Button
          className="ag-show-on-row-interaction"
          component={Link}
          to={data?.linkAction ?? ''}
        >
          {data?.textAction}
        </Button>
      ) : (
        <LoadingButton
          disabled={data?.name === 'DTR summary'}
          className="ag-show-on-row-interaction"
          loadingPosition="start"
          loading={isSubmitting}
          startIcon={<DownloadArrowCircleIcon />}
          onClick={() => {
            downloadFile(fileName);
          }}
        >
          {data?.textAction}
        </LoadingButton>
      );
    },
  },
];

export default function DTRReturnsPage() {
  const { t } = useTranslation(['navigation', 'settings', 'common']);

  const { mutateAsync: downloadFile, isLoading: isSubmitting } =
    useDownloadFile();
  const [contactDetails, setContactDetails] =
    useState<UpsertNonClassContactModalProps['initialState']>(null);

  const columnDefs = useMemo(
    () => getColumnDefs(t, downloadFile, isSubmitting),
    [t, isSubmitting, downloadFile]
  );

  const rowData = useMemo(() => formTypeOptions(t), [t]);

  const handleCreateNonClassContact = () => {
    setContactDetails({});
  };

  const handleCloseEditModal = () => {
    setContactDetails(null);
  };

  return (
    <PageContainer title={t('navigation:management.settings.dtrReturns')}>
      <PageHeading
        title={t('navigation:management.settings.dtrReturns')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={rowData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.name)}
      />
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleCreateNonClassContact}
          startIcon={<AddIcon />}
        >
          {t('settings:actions.addNonClassContact')}
        </Button>
      </Box>
      <Table
        rowData={rowData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.name)}
      />
      <UpsertNonClassContactModal
        onClose={handleCloseEditModal}
        initialState={contactDetails}
      />
    </PageContainer>
  );
}
