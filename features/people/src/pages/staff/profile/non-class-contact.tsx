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
} from '../../../components/staff/upsert-non-class-contact-modal';
import {
  ReturnTypeFromUseNonClassContactHours,
  useNonClassContactHours,
} from '../../../api/staff/non-class-contact';
import {
  DeleteNonClassContactConfirmModal,
  DeleteNonClassContactConfirmModalProps,
} from '../../../components/staff/delete-non-class-contact-confirm-modal';

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
  { field: 'nonClassContactHoursId', hide: true },
  {
    field: 'activity',
    headerName: t('people:activity'),
    valueGetter: ({ data }) =>
      data?.activity ? t(`people:activityValues.${data?.activity}`) : null,
  },
  {
    field: 'dayOfTheWeek',
    headerName: t('people:dayOfWeek'),
    valueGetter: ({ data }) =>
      data?.dayOfTheWeek
        ? t(`people:dayOfWeekValues.${data?.dayOfTheWeek}`)
        : null,
  },
  {
    field: 'hours',
    headerName: t('people:hours'),
    valueGetter: ({ data }) => `${data?.hours ?? 0}h`,
  },
  {
    field: 'minutes',
    headerName: t('people:minutes'),
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
    academicNameSpaceId: activeAcademicNamespace?.academicNamespaceId ?? 1,
    staffPartyId: staffId ?? 12345,
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
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
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
