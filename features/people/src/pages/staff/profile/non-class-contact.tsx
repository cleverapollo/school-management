import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  Table,
  ICellRendererParams,
  ActionMenu,
  useNumber,
  useDebouncedValue,
} from '@tyro/core';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useAcademicNamespace } from '@tyro/api';
import { useParams } from 'react-router-dom';
import {
  UpsertNonClassContactModal,
  UpsertNonClassContactModalProps,
} from '../../../components/staff/non-class-contact/upsert';
import {
  ReturnTypeFromUseNonClassContactHours,
  useNonClassContactHours,
} from '../../../api/staff/non-class-contact';
import {
  DeleteNonClassContactConfirmModal,
  DeleteNonClassContactConfirmModalProps,
} from '../../../components/staff/non-class-contact/delete';

dayjs.extend(LocalizedFormat);

const getNonClassContactColumnDefs = (
  t: TFunction<('people' | 'common')[], undefined, ('people' | 'common')[]>,
  onClickEdit: Dispatch<
    SetStateAction<UpsertNonClassContactModalProps['initialState']>
  >,
  onDelete: Dispatch<
    SetStateAction<
      DeleteNonClassContactConfirmModalProps['nonClassContactHourDetails']
    >
  >,
  numberOfNonClassContacts: number
): GridOptions<ReturnTypeFromUseNonClassContactHours>['columnDefs'] => [
  {
    field: 'activity',
    headerName: t('common:activity'),
    valueGetter: ({ data }) =>
      data?.activity ? t(`people:activityValues.${data?.activity}`) : null,
  },
  {
    field: 'programme',
    headerName: t('people:personal.programme'),
    valueGetter: ({ data }) =>
      data?.programme ? t(`people:programValues.${data?.programme}`) : null,
  },
  {
    field: 'description',
    headerName: t('common:details'),
  },
  {
    field: 'dayOfTheWeek',
    headerName: t('common:dayOfWeek'),
    valueGetter: ({ data }) =>
      data?.dayOfTheWeek
        ? t(`common:dayOfWeekValues.${data?.dayOfTheWeek}`)
        : null,
  },
  {
    colId: 'time',
    headerName: t('common:time'),
    valueGetter: ({ data }) =>
      `${data?.hours ? `${data?.hours}h` : ''}${
        data?.minutes ? ` ${data?.minutes}m` : ''
      }` || '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNonClassContactHours>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
            {
              label: t('common:actions.delete'),
              onClick: () => onDelete(data),
              icon: <TrashIcon />,
              disabled: !numberOfNonClassContacts,
            },
          ]}
        />
      ),
  },
];

export default function StaffProfileNonClassContactPage() {
  const { t } = useTranslation(['navigation', 'people', 'common']);

  const { id } = useParams();
  const staffId = useNumber(id);

  const [contactDetails, setContactDetails] =
    useState<UpsertNonClassContactModalProps['initialState']>(null);
  const { activeAcademicNamespace } = useAcademicNamespace();

  const nonClassContactHoursQueryFilter = {
    academicNameSpaceId: activeAcademicNamespace?.academicNamespaceId ?? 0,
    staffPartyId: staffId ?? 0,
  };

  const { data: nonClassContactHours = [] } = useNonClassContactHours(
    nonClassContactHoursQueryFilter
  );

  const {
    value: nonClassContactToDelete,
    debouncedValue: debouncedNonClassContactToDelete,
    setValue: setNonClassContactToDelete,
  } = useDebouncedValue<
    DeleteNonClassContactConfirmModalProps['nonClassContactHourDetails']
  >({
    defaultValue: null,
  });

  const nonClassContactColumnDefs = getNonClassContactColumnDefs(
    t,
    setContactDetails,
    setNonClassContactToDelete,
    nonClassContactHours?.length ?? 0
  );

  const handleCreateNonClassContact = () => {
    setContactDetails({});
  };

  const handleCloseEditModal = () => {
    setContactDetails(null);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleCreateNonClassContact}
          startIcon={<AddIcon />}
        >
          {t('people:actions.addNonClassContact')}
        </Button>
      </Box>
      <Table
        rowData={nonClassContactHours || []}
        columnDefs={nonClassContactColumnDefs}
        getRowId={({ data }) => String(data?.nonClassContactHoursId)}
      />
      <UpsertNonClassContactModal
        nonClassContactHoursQueryFilter={nonClassContactHoursQueryFilter}
        onClose={handleCloseEditModal}
        initialState={contactDetails}
      />
      <DeleteNonClassContactConfirmModal
        open={!!nonClassContactToDelete}
        nonClassContactHourDetails={debouncedNonClassContactToDelete}
        onClose={() => setNonClassContactToDelete(null)}
      />
    </>
  );
}
