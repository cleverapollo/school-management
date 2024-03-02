import { useMemo } from 'react';
import { GridOptions, Table, ValueGetterParams } from '@tyro/core';
import { alpha, Theme, useTheme } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseOptionsSetup } from '../../../api/options';
import { ReturnTypeFromUseOptionsPreferences } from '../../../api/options-preferences';

interface OptionsSubjectBreakdownTableProps {
  subjectSet: ReturnTypeFromUseOptionsSetup['subjectSets'][number] | undefined;
  studentChoices: ReturnTypeFromUseOptionsPreferences[];
}

function getSubjectBreakdownData(
  subjectSet: ReturnTypeFromUseOptionsSetup['subjectSets'][number] | undefined,
  studentChoices: ReturnTypeFromUseOptionsPreferences[]
) {
  const subjectsRows = subjectSet?.subjects.map((subject) => ({
    subject,
    prefBreakdown: new Map<number, number>(),
  }));
  const subjectIndexesById = new Map(
    subjectsRows?.map(({ subject }, index) => [subject.id, index]) ?? []
  );

  studentChoices.forEach(({ choices }) => {
    choices.forEach(({ subject, id }) => {
      const subjectIndex = subjectIndexesById.get(subject.id);
      if (subjectIndex !== undefined) {
        const { preferenceIdx } = id;
        const currentCount =
          subjectsRows?.[subjectIndex]?.prefBreakdown.get(preferenceIdx);
        subjectsRows?.[subjectIndex]?.prefBreakdown.set(
          preferenceIdx,
          (currentCount ?? 0) + 1
        );
      }
    });
  });

  return subjectsRows ?? [];
}

type SubjectBreakdownRow = ReturnType<typeof getSubjectBreakdownData>[number];

const getBreakdownTableColumns = (
  t: TFunction<('subjectOptions' | 'common')[]>,
  subjectSet: ReturnTypeFromUseOptionsSetup['subjectSets'][number] | undefined,
  theme: Theme
): GridOptions<SubjectBreakdownRow>['columnDefs'] => [
  {
    colId: 'subject',
    headerName: 'Subject',
    valueGetter: ({ data }) => data?.subject?.shortCode,
    cellStyle: ({ data }) => ({
      backgroundColor: alpha(
        theme.palette[data?.subject?.colour ?? 'slate'].main,
        0.16
      ),
      color:
        theme.palette[data?.subject?.colour ?? 'slate'][
          theme.isLight ? 'dark' : 'light'
        ],
      fontWeight: '600',
    }),
    pinned: 'left',
    suppressMenu: true,
    sortable: false,
    width: 72,
  },
  ...Array.from(
    { length: subjectSet?.mustGet ?? 0 },
    (_, preferenceIdx) =>
      ({
        coldId: `pref-${preferenceIdx}`,
        headerName: t('subjectOptions:prefX', { x: preferenceIdx + 1 }),
        valueGetter: ({ data }: ValueGetterParams<SubjectBreakdownRow>) =>
          data?.prefBreakdown?.get(preferenceIdx) ?? 0,
        width: 64,
        suppressMenu: true,
        sortable: false,
        sort: 'desc',
        sortIndex: preferenceIdx,
      } as const)
  ),
  {
    colId: 'total',
    headerName: t('common:total'),
    valueGetter: ({ data }) => {
      const mustGetPrefIdxs = Array.from(
        { length: subjectSet?.mustGet ?? 0 },
        (_, i) => i
      );
      return mustGetPrefIdxs.reduce(
        (acc, preferenceIdx) =>
          acc + (data?.prefBreakdown?.get(preferenceIdx) ?? 0),
        0
      );
    },
  },
  ...Array.from(
    { length: (subjectSet?.canChoose ?? 0) - (subjectSet?.mustGet ?? 0) },
    (_, i) => {
      const preferenceIdx = i + (subjectSet?.mustGet ?? 0);
      return {
        colId: `pref-${preferenceIdx}`,
        headerName: t('subjectOptions:reserveX', { x: i + 1 }),
        valueGetter: ({ data }: ValueGetterParams<SubjectBreakdownRow>) =>
          data?.prefBreakdown?.get(preferenceIdx) ?? 0,
        width: 64,
        cellClass: 'outside-get',
        headerClass: 'outside-get',
        suppressMenu: true,
        sortable: false,
        sort: 'desc',
        sortIndex: preferenceIdx,
      } as const;
    }
  ),
  {
    colId: 'totalIncludingReserves',
    headerName: t('subjectOptions:totalIncludingReserves'),
    cellClass: 'outside-get',
    headerClass: 'outside-get',
    valueGetter: ({ data }) => {
      const allPrefIdxs = Array.from(
        { length: subjectSet?.canChoose ?? 0 },
        (_, i) => i
      );
      return allPrefIdxs.reduce(
        (acc, preferenceIdx) =>
          acc + (data?.prefBreakdown?.get(preferenceIdx) ?? 0),
        0
      );
    },
  },
];

export function OptionsSubjectBreakdownTable({
  subjectSet,
  studentChoices,
}: OptionsSubjectBreakdownTableProps) {
  const theme = useTheme();
  const { t } = useTranslation(['common', 'subjectOptions']);
  const tableData = useMemo(
    () => getSubjectBreakdownData(subjectSet, studentChoices),
    [subjectSet, studentChoices]
  );

  const tableColumns = useMemo(
    () => getBreakdownTableColumns(t, subjectSet, theme),
    [t, subjectSet, theme]
  );

  return (
    <Table
      sx={{
        '& .ag-header-cell, & .ag-cell': {
          backgroundColor: 'white',
          px: 1,
        },
        '& .outside-get, & .ag-row, & .ag-header-viewport': {
          backgroundColor: 'slate.100',
        },
        minHeight: '64px',
        height: tableData.length * 32 + 32,
        flex: '0 1 auto',
      }}
      rowData={tableData}
      columnDefs={tableColumns}
      rowSelection="multiple"
      getRowId={({ data }) => JSON.stringify(data?.subject?.id)}
      headerHeight={32}
      rowHeight={32}
      // eslint-disable-next-line react/jsx-no-useless-fragment
      toolbar={<></>}
    />
  );
}
