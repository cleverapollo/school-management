import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import {
  CellClassParams,
  GridOptions,
  Table,
  ValueGetterParams,
} from '@tyro/core';
import { alpha, Theme, useTheme } from '@mui/material';
import { Colour } from '@tyro/api';
import { ReturnTypeFromUseOptionsSetup } from '../../../api/options';
import { ReturnTypeFromUseOptionsPreferences } from '../../../api/options-preferences';

interface OptionsMatrixTableProps {
  subjectSets: ReturnTypeFromUseOptionsSetup['subjectSets'] | undefined;
  studentChoices: ReturnTypeFromUseOptionsPreferences[];
}

const availableColors = [...Object.values(Colour), 'slate'] as const;

function getMatrixData(
  subjectSets: ReturnTypeFromUseOptionsSetup['subjectSets'] | undefined,
  studentChoices: ReturnTypeFromUseOptionsPreferences[]
) {
  const allSubjects = subjectSets?.flatMap(({ subjects }) => subjects) ?? [];
  const filteredSubjects = uniqBy(allSubjects, 'id').sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const allSubjectIds = filteredSubjects.map(({ id }) => id);
  const choiceIdsToInclude =
    subjectSets?.flatMap(({ id, mustGet }) =>
      Array.from({ length: mustGet }, (_, i) => `${id.idx}-${i}`)
    ) ?? [];

  const crossOvers = new Map<number, Map<number, number>>();

  allSubjectIds.forEach((subjectId) => {
    const subjectMap = new Map<number, number>();

    studentChoices.forEach(({ choices }) => {
      const choiceIds = choices
        .filter(({ id: { subjectSetIdx, preferenceIdx } }) =>
          choiceIdsToInclude.includes(`${subjectSetIdx}-${preferenceIdx}`)
        )
        .map(({ subject }) => subject.id);

      choiceIds.forEach((choiceId) => {
        const currentValue = subjectMap.get(choiceId) ?? 0;

        if (subjectId !== choiceId && choiceIds.includes(subjectId)) {
          subjectMap.set(choiceId, currentValue + 1);
        }
      });
    });

    crossOvers.set(subjectId, subjectMap);
  });

  return filteredSubjects
    .sort((a, b) => {
      const aCrossOvers = crossOvers.get(a.id) ?? new Map<number, number>();
      const bCrossOvers = crossOvers.get(b.id) ?? new Map<number, number>();

      const aTotal = Array.from(aCrossOvers.values()).reduce(
        (acc, curr) => acc + curr,
        0
      );
      const bTotal = Array.from(bCrossOvers.values()).reduce(
        (acc, curr) => acc + curr,
        0
      );

      return bTotal - aTotal;
    })
    .map((subject) => ({
      subject,
      crossOvers: crossOvers.get(subject.id),
    }));
}

type MatrixDataRow = ReturnType<typeof getMatrixData>[number];

const getMatrixTableColumns = (
  subjectData: MatrixDataRow[],
  theme: Theme
): GridOptions<MatrixDataRow>['columnDefs'] => [
  {
    colId: 'subject',
    headerName: 'Subject',
    valueGetter: ({ data }) => data?.subject?.shortCode,
    cellStyle: () => ({
      fontWeight: '600',
    }),
    cellClass: ({ data }) => `bg-${data?.subject?.colour ?? 'slate'}`,
    pinned: 'left',
    suppressMenu: true,
    sortable: false,
    width: 72,
  },
  ...subjectData.map(({ subject }) => ({
    colId: JSON.stringify(subject.id),
    headerName: subject.shortCode,
    valueGetter: ({ data }: ValueGetterParams<MatrixDataRow>) => {
      if (data?.subject.id === subject.id) return '';
      return data?.crossOvers?.get(subject.id) ?? 0;
    },
    headerClass: () => `bg-${subject?.colour ?? 'slate'}`,
    cellStyle: ({ data }: CellClassParams<MatrixDataRow>) => ({
      backgroundColor:
        data?.subject.id === subject.id
          ? alpha(theme.palette[data?.subject?.colour ?? 'slate'].main, 0.16)
          : 'transparent',
      justifyContent: 'center',
    }),
    width: 48,
    suppressMenu: true,
    sortable: false,
  })),
];

export function OptionsMatrixTable({
  subjectSets,
  studentChoices,
}: OptionsMatrixTableProps) {
  const theme = useTheme();
  const tableData = useMemo(
    () => getMatrixData(subjectSets, studentChoices),
    [subjectSets, studentChoices]
  );

  const tableColumns = useMemo(
    () => getMatrixTableColumns(tableData, theme),
    [tableData, theme]
  );

  return (
    <Table
      sx={{
        ...availableColors.reduce((acc, color) => {
          acc[`& .bg-${color}`] = {
            color: theme.palette[color][theme.isLight ? 'dark' : 'light'],
            backgroundColor: alpha(theme.palette[color].main, 0.16),
          };
          return acc;
        }, {} as Record<string, unknown>),
        '& .ag-header-container .ag-header-cell .ag-header-cell-label': {
          justifyContent: 'center',
        },
        '& .ag-header-cell, & .ag-cell': {
          px: 1,
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
