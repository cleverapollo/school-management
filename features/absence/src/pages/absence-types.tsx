import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  PageContainer,
  PageHeading,
  TuslaCodeSelectCellEditor,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { TuslaCode } from '@tyro/api';
import { useMemo } from 'react';
import { ReturnTypeFromUseAbsenceTypes, useAbsenceTypes } from '../api';

const tuslaCodes = Object.values(TuslaCode);

const getAbsenceCodeColumns = (
  t: TFunction<('common' | 'absence')[], undefined, ('absence' | 'absence')[]>
): GridOptions<ReturnTypeFromUseAbsenceTypes>['columnDefs'] => [
  {
    field: 'code',
    headerName: t('absence:tuslaCode'),
    sort: 'asc',
    editable: true,
    lockVisible: true,
    cellEditorSelector: TuslaCodeSelectCellEditor(),
    onCellValueChanged: (params) => {
      if (
        params.newValue &&
        tuslaCodes.includes(params.newValue as TuslaCode)
      ) {
        params.node?.setDataValue(
          'description',
          t(`absence:tuslaCodeDescription.${params.newValue as TuslaCode}`)
        );
      }
    },
  },
  {
    field: 'name',
    editable: true,
    headerName: t('absence:absenceCodeName'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    editable: ({ data }) =>
      !(data?.code && tuslaCodes.includes(data?.code as TuslaCode)),
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsenceTypes>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('absence:editAbsenceCode'),
            },
          ]}
        />
      ),
  },
];

export default function AbsenceTypes() {
  const { t, i18n } = useTranslation(['common', 'absence']);
  const currentLanguageCode = i18n.language;
  const { data: absenceCodes } = useAbsenceTypes({});

  const absenceCodeColumns = useMemo(() => getAbsenceCodeColumns(t), [t]);

  return (
    <PageContainer title={t('absence:absenceCodes')}>
      <PageHeading
        title={t('absence:absenceCodes')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => {}}
              startIcon={<AddIcon />}
            >
              {t('absence:createAbsenceCode')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={absenceCodes ?? []}
        columnDefs={absenceCodeColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.absenceTypeId)}
      />
    </PageContainer>
  );
}
