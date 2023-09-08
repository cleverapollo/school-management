import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  PageHeading,
  Table,
  PageContainer,
  ICellRendererParams,
  ActionMenu,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import {
  AddIcon,
  DownloadArrowCircleIcon,
  EditIcon,
  TrashIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { DeleteNonClassContactHoursInput } from '@tyro/api';
import { useDownloadFile } from '../../api/dtr-returns/download-file';
import {
  UpsertNonClassContactModal,
  UpsertNonClassContactModalProps,
} from '../../components/dtr-returns/upsert-non-class-contact-modal';
import {
  ReturnTypeFromUseNonClassContactHours,
  useNonClassContactHours,
} from '../../api/dtr-returns/non-class-contact';
import { useDeleteNonClassContact } from '../../api/dtr-returns/delete-non-class-contact';

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

const getDtrReturnColumnDefs = (
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

const getNonClassContactColumnDefs = (
  t: TFunction<('settings' | 'common')[], undefined, ('settings' | 'common')[]>,
  onClickEdit: Dispatch<
    SetStateAction<UpsertNonClassContactModalProps['initialState']>
  >,
  onDelete: UseMutateAsyncFunction<
    unknown,
    unknown,
    DeleteNonClassContactHoursInput
  >,
  numberOfNonClassContacts: number
): GridOptions<ReturnTypeFromUseNonClassContactHours>['columnDefs'] => [
  { field: 'nonClassContactHoursId', hide: true },
  {
    field: 'staffPartyId',
    headerName: t('common:teacher'),
  },
  {
    field: 'activity',
    headerName: t('settings:dtrReturns.activity'),
    valueGetter: ({ data }) =>
      data?.activity
        ? t(`settings:dtrReturns.activityValues.${data?.activity}`)
        : null,
  },
  {
    field: 'dayOfTheWeek',
    headerName: t('settings:dtrReturns.dayOfWeek'),
    valueGetter: ({ data }) =>
      data?.dayOfTheWeek
        ? t(`settings:dtrReturns.dayOfWeekValues.${data?.dayOfTheWeek}`)
        : null,
  },
  {
    field: 'hours',
    headerName: t('settings:dtrReturns.hours'),
    valueGetter: ({ data }) => `${data?.hours ?? 0}h`,
  },
  {
    field: 'minutes',
    headerName: t('settings:dtrReturns.minutes'),
    valueGetter: ({ data }) => `${data?.minutes ?? 0}min`,
  },
  {
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNonClassContactHours>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:dtrReturns.editNonClassContact'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () =>
                onDelete({
                  nonClassContactHoursId: data.nonClassContactHoursId,
                  staffPartyId: data.staffPartyId,
                }),
              disabled: !numberOfNonClassContacts,
            },
          ]}
        />
      ),
  },
];

export default function DTRReturnsPage() {
  const { t } = useTranslation(['navigation', 'settings', 'common']);

  const { mutateAsync: downloadFile, isLoading: isSubmitting } =
    useDownloadFile();
  const [contactDetails, setContactDetails] =
    useState<UpsertNonClassContactModalProps['initialState']>(null);

  const dtrReturnColumnDefs = useMemo(
    () => getDtrReturnColumnDefs(t, downloadFile, isSubmitting),
    [t, isSubmitting, downloadFile]
  );
  const { mutateAsync: deleteNonClassContact } = useDeleteNonClassContact();

  const dtrReturnRowData = useMemo(() => formTypeOptions(t), [t]);
  const { data: nonClassContactHours = [] } = useNonClassContactHours({
    staffPartyId: 12345,
    academicNameSpaceId: 1,
  });

  const nonClassContactColumnDefs = getNonClassContactColumnDefs(
    t,
    setContactDetails,
    deleteNonClassContact,
    nonClassContactHours?.length ?? 0
  );

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
        rowData={dtrReturnRowData || []}
        columnDefs={dtrReturnColumnDefs}
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
        rowData={nonClassContactHours || []}
        columnDefs={nonClassContactColumnDefs}
        getRowId={({ data }) => String(data?.nonClassContactHoursId)}
      />
      <UpsertNonClassContactModal
        onClose={handleCloseEditModal}
        initialState={contactDetails}
      />
    </PageContainer>
  );
}
