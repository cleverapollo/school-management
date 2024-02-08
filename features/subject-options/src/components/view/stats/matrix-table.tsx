import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import { GridOptions, Table, ValueGetterParams } from '@tyro/core';
import { ReturnTypeFromUseOptionsSetup } from '../../../api/options';
import { ReturnTypeFromUseOptionsPreferences } from '../../../api/options-preferences';

interface OptionsMatrixTableProps {
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined;
  studentChoices: ReturnTypeFromUseOptionsPreferences[];
}

function getMatrixData(
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  studentChoices: ReturnTypeFromUseOptionsPreferences[]
) {
  const allSubjects =
    optionsSetup?.subjectSets.flatMap(({ subjects }) => subjects) ?? [];
  const filteredSubjects = uniqBy(allSubjects, 'id').sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const allSubjectIds = filteredSubjects.map(({ id }) => id);

  const crossOvers = new Map<number, Map<number, number>>();

  allSubjectIds.forEach((subjectId) => {
    const subjectMap = new Map<number, number>();

    studentChoices.forEach(({ choices }) => {
      const choiceIds = choices.map(({ subject }) => subject.id);

      choiceIds.forEach((choiceId) => {
        const currentValue = subjectMap.get(choiceId) ?? 0;

        if (subjectId !== choiceId && choiceIds.includes(subjectId)) {
          subjectMap.set(choiceId, currentValue + 1);
        }
      });
    });

    crossOvers.set(subjectId, subjectMap);
  });

  return filteredSubjects.map((subject) => ({
    subject,
    crossOvers: crossOvers.get(subject.id),
  }));
}

type MatrixDataRow = ReturnType<typeof getMatrixData>[number];

const getMatrixTableColumns = (
  subjectData: MatrixDataRow[]
): GridOptions<MatrixDataRow>['columnDefs'] => [
  {
    colId: 'subject',
    headerName: 'Subject',
    valueGetter: ({ data }) => data?.subject?.name,
  },
  ...subjectData.map(({ subject }) => ({
    colId: JSON.stringify(subject.id),
    headerName: subject.name,
    valueGetter: ({ data }: ValueGetterParams<MatrixDataRow>) =>
      data?.crossOvers?.get(subject.id) ?? 0,
  })),
];

export function OptionsMatrixTable({
  optionsSetup,
  studentChoices,
}: OptionsMatrixTableProps) {
  const tableData = useMemo(
    () => getMatrixData(optionsSetup, studentChoices),
    [optionsSetup, studentChoices]
  );

  const tableColumns = useMemo(
    () => getMatrixTableColumns(tableData),
    [tableData]
  );

  return (
    <Table
      rowData={tableData}
      columnDefs={tableColumns}
      rowSelection="multiple"
      getRowId={({ data }) => JSON.stringify(data?.subject?.id)}
    />
  );
}
