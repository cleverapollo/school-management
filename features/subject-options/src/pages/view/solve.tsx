import { LoadingButton } from '@mui/lab';
import { Button, Chip, Stack } from '@mui/material';
import {
  getNumber,
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  useDisclosure,
  usePreferredNameLayout,
  ValueFormatterParams,
  ValueGetterParams,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { GearIcon } from '@tyro/icons';
import { StudentTableAvatar } from '@tyro/people';
import { getPersonProfileLink, OptionsSol_SolverOperation } from '@tyro/api';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  ReturnTypeFromUseOptionsSetup,
  useOptionsSetup,
} from '../../api/options';
import { SolveSettingsModal } from '../../components/view/solve/settings-modal';
import {
  ReturnTypeFromUseOptionsSolutions,
  useOptionsSolutions,
} from '../../api/options-solutions';
import { useSolveOptions } from '../../api/solve';

type OptionsAssignedValue =
  ReturnTypeFromUseOptionsSolutions['pools'][number]['subjectSets'][number]['studentChoices'][number]['subjectSetChoices'][number]['mainChoices'][number];

type StudentRow = {
  student: NonNullable<ReturnTypeFromUseOptionsSetup['students']>[number];
  missedPreferences: number;
  optionsAssigned: Map<string, OptionsAssignedValue>;
};

const getStudentRows = (
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  optionsSolutions: ReturnTypeFromUseOptionsSolutions | undefined
): StudentRow[] => {
  const studentsOptionsAssigned = new Map<
    number,
    Map<string, OptionsAssignedValue>
  >();
  // TODO - implement missing preferences
  const studentMissingPreferences = new Map<number, number>();

  optionsSolutions?.pools?.forEach(({ subjectSets }) => {
    subjectSets.forEach(({ studentChoices }) => {
      studentChoices.forEach(({ studentPartyId, subjectSetChoices }) => {
        const currentStudentsOptionsAssigned = subjectSetChoices.reduce<
          Map<string, OptionsAssignedValue>
        >((acc, { subjectSetIdx, mainChoices }) => {
          mainChoices.forEach((choice) => {
            if (subjectSetIdx) {
              acc.set(`${subjectSetIdx}-${choice.choiceIdx}`, choice);
            }
          });
          return acc;
        }, new Map());
        studentsOptionsAssigned.set(
          studentPartyId,
          currentStudentsOptionsAssigned
        );
      });
    });
  });

  return (optionsSetup?.students ?? []).map((student) => ({
    student,
    missedPreferences: studentMissingPreferences.get(student.partyId) ?? 0,
    optionsAssigned: studentsOptionsAssigned.get(student.partyId) ?? new Map(),
  }));
};

const getStudentAssignmentColumns = (
  t: TFunction<
    ('common' | 'subjectOptions')[],
    undefined,
    ('common' | 'subjectOptions')[]
  >,
  displayName: ReturnTypeDisplayName,
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined
): GridOptions<StudentRow>['columnDefs'] => [
  {
    colId: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({ data }: ICellRendererParams<StudentRow, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student}
          to={getPersonProfileLink(data?.student)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    filter: true,
    pinned: 'left',
  },
  {
    field: 'missedPreferences',
    headerName: t('subjectOptions:prefsMissed'),
  },
  ...(optionsSetup?.subjectSets?.map((subjectSet) => ({
    colId: JSON.stringify(subjectSet.id),
    headerName: subjectSet.name,
    headerClass: subjectSet.id.idx !== 1 ? 'border-left' : undefined,
    children: Array.from(Array(subjectSet.canChoose)).map(
      (_, preferenceIdx) => {
        const colId = `${subjectSet.id.idx}-${preferenceIdx}`;
        const isOutsideWhatTheyGet = preferenceIdx > subjectSet.mustGet - 1;
        const showLeftBorder = preferenceIdx === 0 && subjectSet.id.idx !== 1;

        return {
          field: `choices.${colId}`,
          headerName: t('subjectOptions:prefX', { x: preferenceIdx + 1 }),
          cellClass: [
            isOutsideWhatTheyGet && 'outside-get',
            showLeftBorder && 'border-left',
          ].filter(Boolean),
          headerClass: [
            isOutsideWhatTheyGet && 'outside-get',
            showLeftBorder && 'border-left',
          ].filter(Boolean),
          valueGetter: ({ data }: ValueGetterParams<StudentRow, any>) =>
            data?.optionsAssigned.get(colId),
          cellRenderer: ({
            value,
          }: ICellRendererParams<
            StudentRow,
            ReturnType<StudentRow['optionsAssigned']['get']>
          >) => {
            if (!value) return '-';

            const { subjectGroupName, subject } = value;

            return (
              <Chip
                size="small"
                variant="soft"
                color={subject.colour ?? 'slate'}
                label={subjectGroupName}
              />
            );
          },
          valueFormatter: ({
            value,
          }: ValueFormatterParams<
            StudentRow,
            ReturnType<StudentRow['optionsAssigned']['get']>
          >) => value?.subject?.name ?? '-',
        };
      }
    ),
  })) ?? []),
];

export default function StudentOptionsSolvePage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { displayName } = usePreferredNameLayout();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: optionsSolutions } = useOptionsSolutions({ optionId });
  const { mutateAsync: solveOptions } = useSolveOptions();

  const studentRows = useMemo(
    () => getStudentRows(optionsSetup, optionsSolutions),
    [optionsSetup, optionsSolutions]
  );

  const studentAssignmentColumns = useMemo(
    () => getStudentAssignmentColumns(t, displayName, optionsSetup),
    [t, displayName, optionsSetup]
  );

  const toggleSolver = () => {
    solveOptions({
      // operation: optionsSolutions?.solverRunning
      //   ? OptionsSol_SolverOperation.Stop
      //   : OptionsSol_SolverOperation.Start,
      operation: OptionsSol_SolverOperation.Start,
      optionId,
    });
  };

  console.log({ optionsSolutions });

  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onOpen} variant="outlined" endIcon={<GearIcon />}>
            {t('subjectOptions:solverSettings')}
          </Button>
          <Button variant="contained" color="primary" onClick={toggleSolver}>
            {/* {optionsSolutions?.solverRunning
              ? t('common:solve')
              : t('subjectOptions:stopSolver')} */}
            {t('common:solve')}
          </Button>
        </Stack>
        <Table
          sx={{
            '& .outside-get': {
              backgroundColor: 'slate.100',
            },
            '& .border-left': {
              borderLeft: '1px solid',
              borderLeftColor: 'slate.200',
            },
          }}
          rowData={studentRows}
          columnDefs={studentAssignmentColumns}
          getRowId={({ data }) => JSON.stringify(data?.student?.partyId)}
        />
      </Stack>
      <SolveSettingsModal
        optionsId={optionId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
