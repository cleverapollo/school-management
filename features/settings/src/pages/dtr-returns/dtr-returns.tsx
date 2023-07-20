import { Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  PageHeading,
  Table,
  PageContainer,
  ICellRendererParams,
} from '@tyro/core';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';

dayjs.extend(LocalizedFormat);

type DtrReturn = {
  name: string;
  description: string;
  textAction: string;
  linkAction?: string;
  clickAction?: () => void;
};

const getColumnDefs = (
  t: TFunction<('settings' | 'common')[], undefined, ('settings' | 'common')[]>
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
    field: 'textAction',
    headerName: '',
    suppressSizeToFit: true,
    cellRenderer: ({ data }: ICellRendererParams<DtrReturn, any>) =>
      data && (
        <Button
          className="ag-show-on-row-interaction"
          component={Link}
          to={data?.linkAction ?? ''}
        >
          {data?.textAction}
        </Button>
      ),
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

  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

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
