import { useMemo } from 'react';
import { Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  PageHeading,
  Table,
  PageContainer,
  ICellRendererParams,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { DownloadArrowCircleIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import { useDownloadFile } from '../../api/dtr-returns/download-file';

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
  FormTL: 'FORM_TL',
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

  const columnDefs = useMemo(
    () => getColumnDefs(t, downloadFile, isSubmitting),
    [t, isSubmitting, downloadFile]
  );

  const rowData = useMemo(() => formTypeOptions(t), [t]);

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
    </PageContainer>
  );
}
