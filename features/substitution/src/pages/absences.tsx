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
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useMemo } from 'react';
import { AddIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseStaffWorkAbsences,
  useStaffWorkAbsences,
} from '../api/staff-work-absences';
import {
  UpsertAbsenceModal,
  UpsertAbsenceModalProps,
} from '../components/absences/upsert-absence-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  translate: TFunction<
    ('common' | 'substitution')[],
    undefined,
    ('common' | 'substitution')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseStaffWorkAbsences>['columnDefs'] => [
  {
    field: 'staff',
    headerName: translate('substitution:absentStaff'),
    valueGetter: ({ data }) => displayName(data?.staff ?? undefined),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStaffWorkAbsences>) => (
      <TablePersonAvatar person={data?.staff ?? undefined} />
    ),
  },
  {
    field: 'absenceType',
    headerName: translate('substitution:reason'),
    valueGetter: ({ data }) => data?.absenceType.name,
  },
  {
    field: 'dates',
    headerName: translate('common:dates'),
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

  const { data: absencesData } = useStaffWorkAbsences({});

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
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
    </>
  );
}
