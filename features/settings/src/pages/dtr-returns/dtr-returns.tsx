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
import { useDownloadFileB } from '../../api/dtr-returns/download-file';

dayjs.extend(LocalizedFormat);

type DtrReturn = {
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

const getColumnDefs = (
  t: TFunction<('settings' | 'common')[], undefined, ('settings' | 'common')[]>,
  downloadFileB: (test: string) => void,
  isSubmitting: boolean
): GridOptions<DtrReturn>['columnDefs'] => [
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
      const fileName =
        fileNames[data?.name?.split(' ')?.join('') as keyof typeof fileNames] ||
        '';

      return fileName === fileNames.FileB ? (
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
            downloadFileB(fileName);
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

  const formTypeOptions: DtrReturn[] = [
    {
      name: t('settings:dtrReturns.fileA'),
      description: t('settings:dtrReturns.descriptionA'),
      textAction: t('settings:dtrReturns.downloadFile'),
    },
    {
      name: t('settings:dtrReturns.fileB'),
      description: t('settings:dtrReturns.descriptionB'),
      textAction: t('settings:dtrReturns.viewFile'),
      linkAction: './file-b',
    },
    {
      name: t('settings:dtrReturns.fileC'),
      description: t('settings:dtrReturns.descriptionC'),
      textAction: t('settings:dtrReturns.downloadFile'),
    },
    {
      name: t('settings:dtrReturns.fileD'),
      description: t('settings:dtrReturns.descriptionD'),
      textAction: t('settings:dtrReturns.downloadFile'),
    },
    {
      name: t('settings:dtrReturns.fileE'),
      description: t('settings:dtrReturns.descriptionE'),
      textAction: t('settings:dtrReturns.downloadFile'),
    },
    {
      name: t('settings:dtrReturns.dtrSummary'),
      description: t('settings:dtrReturns.descriptionDtrSummary'),
      textAction: t('settings:dtrReturns.downloadFile'),
    },
  ];

  const { mutateAsync: downloadFileB, isLoading: isSubmitting } =
    useDownloadFileB();

  const columnDefs = useMemo(
    () => getColumnDefs(t, downloadFileB, isSubmitting),
    [t, isSubmitting, downloadFileB]
  );

  return (
    <PageContainer title={t('navigation:management.settings.dtrReturns')}>
      <PageHeading
        title={t('navigation:management.settings.dtrReturns')}
        titleProps={{ variant: 'h3' }}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.settings.dtrReturns'),
              href: '.',
            },
            {
              name: t('common:overview'),
            },
          ],
        }}
      />
      <Table
        rowData={formTypeOptions || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.name)}
      />
    </PageContainer>
  );
}
