import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  TablePersonAvatar,
  PageContainer,
  PageHeading,
  useDebouncedValue,
  ActionMenu,
  commonActionMenuProps,
} from '@tyro/core';
import { Box, Button } from '@mui/material';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { Dispatch, SetStateAction, useMemo } from 'react';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseStaffWorkAbsences,
  useStaffWorkAbsences,
} from '../api/staff-work-absences';
import {
  UpsertAbsenceModal,
  UpsertAbsenceModalProps,
} from '../components/absences/upsert-absence-modal';
import { LongTermLeaveCell } from '../components/absences/long-term-leave-cell';
import {
  TableDatesList,
  getDateListString,
} from '../components/absences/table-dates-list';
import {
  DeleteAbsenceConfirmModal,
  DeleteAbsenceConfirmModalProps,
} from '../components/absences/delete-confirm-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<
    ('common' | 'substitution')[],
    undefined,
    ('common' | 'substitution')[]
  >,
  displayName: ReturnTypeDisplayName,
  setAbsenceDetails: Dispatch<
    SetStateAction<UpsertAbsenceModalProps['initialAbsenceData']>
  >,
  setAbsenceToDelete: Dispatch<
    SetStateAction<DeleteAbsenceConfirmModalProps['absenceDetails']>
  >
): GridOptions<ReturnTypeFromUseStaffWorkAbsences>['columnDefs'] => [
  {
    field: 'staff',
    headerName: t('substitution:absentStaff'),
    valueGetter: ({ data }) => displayName(data?.staff ?? undefined),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences>) => (
      <TablePersonAvatar person={data?.staff ?? undefined} />
    ),
    sortable: true,
    filter: true,
  },
  {
    field: 'absenceType',
    headerName: t('substitution:reason'),
    valueGetter: ({ data }) => data?.absenceType.name,
    sortable: true,
    filter: true,
  },
  {
    field: 'dates',
    headerName: t('common:dates'),
    sortable: true,
    sort: 'desc',
    comparator: (
      datesA: ReturnTypeFromUseStaffWorkAbsences['dates'],
      datesB: ReturnTypeFromUseStaffWorkAbsences['dates']
    ) => {
      const firstDateA = datesA[0];
      const dateA =
        firstDateA?.individualDates?.[0] || firstDateA?.continuousStartDate;

      const firstDateB = datesB[0];
      const dateB =
        firstDateB?.individualDates?.[0] || firstDateB?.continuousStartDate;

      return dayjs(dateA).unix() - dayjs(dateB).unix();
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences, any>) => (
      <TableDatesList dates={data?.dates ?? []} />
    ),
    valueFormatter: ({ data }) => getDateListString(data?.dates ?? [], t),
    autoHeight: true,
    wrapText: true,
  },
  {
    field: 'longTermLeaveGroups',
    headerName: t('substitution:longTermLeave'),
    valueGetter: ({ data }) =>
      data?.longTermLeaveGroups
        ? `${data?.longTermLeaveGroups.reduce(
            (acc, group) => (group.coveringStaffId ? acc + 1 : acc),
            0
          )}/${data?.longTermLeaveGroups?.length}`
        : '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences, any>) => {
      if (data?.isLongTermLeave) {
        return data && <LongTermLeaveCell absence={data} />;
      }
      return <>-</>;
    },
    sortable: true,
    filter: true,
  },
  {
    field: 'absenceReasonText',
    headerName: t('substitution:note'),
    sortable: true,
    filter: 'agTextColumnFilter',
    width: 200,
    cellStyle: {
      display: 'block',
    },
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              onClick: () => {
                setAbsenceDetails(data);
              },
            },
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => {
                setAbsenceToDelete(data);
              },
            },
          ]}
        />
      ),
  },
];

export default function Absences() {
  const { t } = useTranslation(['common', 'navigation', 'substitution']);
  const { displayName } = usePreferredNameLayout();
  const {
    value: absenceDetails,
    debouncedValue: debouncedAbsenceDetails,
    setValue: setAbsenceDetails,
  } = useDebouncedValue<UpsertAbsenceModalProps['initialAbsenceData']>({
    defaultValue: null,
  });
  const {
    value: absenceToDelete,
    debouncedValue: debouncedAbsenceToDelete,
    setValue: setAbsenceToDelete,
  } = useDebouncedValue<DeleteAbsenceConfirmModalProps['absenceDetails']>({
    defaultValue: null,
  });

  const { data: absencesData } = useStaffWorkAbsences({});

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, setAbsenceDetails, setAbsenceToDelete),
    [t, displayName]
  );

  return (
    <>
      <PageContainer title={t('navigation:management.substitution.absences')}>
        <PageHeading
          title={t('navigation:management.substitution.absences')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAbsenceDetails({})}
              >
                {t('substitution:createStaffAbsence')}
              </Button>
            </Box>
          }
        />
        <Table
          rowData={absencesData || []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data.absenceId)}
        />
      </PageContainer>
      <UpsertAbsenceModal
        open={!!absenceDetails}
        onClose={() => setAbsenceDetails(null)}
        initialAbsenceData={absenceDetails || debouncedAbsenceDetails}
      />
      <DeleteAbsenceConfirmModal
        open={!!absenceToDelete}
        onClose={() => setAbsenceToDelete(null)}
        absenceDetails={absenceToDelete || debouncedAbsenceToDelete}
      />
    </>
  );
}
