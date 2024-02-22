import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
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
import {
  getPersonProfileLink,
  OptionsSol_SolverOperation,
  getColorBasedOnIndex,
  SolutionStatus,
} from '@tyro/api';
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
  ReturnTypeFromUseOptionsSolutions['pools'][number]['subjectSets'][number]['studentChoices'][number]['subjectSetChoices'][number];

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
  const studentMissingPreferences = new Map<number, number>();

  optionsSolutions?.pools?.forEach(({ poolIdx, subjectSets }) => {
    subjectSets.forEach(({ id, studentChoices }) => {
      studentChoices.forEach(
        ({ studentPartyId, missed = 0, subjectSetChoices }) => {
          studentMissingPreferences.set(
            studentPartyId,
            (studentMissingPreferences.get(studentPartyId) ?? 0) + missed
          );

          const currentStudentsOptionsAssigned = subjectSetChoices.reduce<
            Map<string, OptionsAssignedValue>
          >((acc, choice) => {
            acc.set(`${poolIdx}-${id.idx}-${choice.choiceIdx}`, choice);
            return acc;
          }, new Map(studentsOptionsAssigned.get(studentPartyId) ?? []));
          studentsOptionsAssigned.set(
            studentPartyId,
            currentStudentsOptionsAssigned
          );
        }
      );
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
    valueGetter: ({ data }) => displayName(data?.student.person),
    cellRenderer: ({ data }: ICellRendererParams<StudentRow, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student.person}
          to={getPersonProfileLink(data?.student.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    lockVisible: true,
    filter: true,
    pinned: 'left',
    suppressMenu: true,
  },
  {
    field: 'missedPreferences',
    headerName: t('subjectOptions:missed'),
    suppressMenu: true,
    pinned: 'left',
  },
  ...(optionsSetup?.subjectSets?.map((subjectSet) => ({
    colId: JSON.stringify(subjectSet.id),
    headerName: subjectSet.name,
    headerClass: subjectSet.id.idx !== 1 ? 'border-left' : undefined,
    children: Array.from(Array(subjectSet.canChoose)).map(
      (_, preferenceIdx) => {
        const colId = `${subjectSet.poolIdx ?? 0}-${
          subjectSet.id.idx
        }-${preferenceIdx}`;
        const isOutsideWhatTheyGet = preferenceIdx > subjectSet.mustGet - 1;
        const showLeftBorder = preferenceIdx === 0 && subjectSet.id.idx !== 1;

        return {
          field: `optionsAssigned.${colId}`,
          headerName: t('subjectOptions:prefX', { x: preferenceIdx + 1 }),
          suppressMenu: true,
          sortable: false,
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

            const { subjectGroupName, subject, blockIdx } = value;

            if (subjectGroupName && typeof blockIdx === 'number') {
              return (
                <Chip
                  size="small"
                  variant="soft"
                  color={getColorBasedOnIndex(blockIdx)}
                  label={subjectGroupName}
                />
              );
            }

            return (
              <Box component="span" color="text.secondary">
                {subject.shortCode}
              </Box>
            );
          },
          valueFormatter: ({
            value,
          }: ValueFormatterParams<
            StudentRow,
            ReturnType<StudentRow['optionsAssigned']['get']>
          >) => value?.subjectGroupName ?? value?.subject?.shortCode ?? '-',
        };
      }
    ),
  })) ?? []),
];

function SolverStatus({ status }: { status: SolutionStatus | undefined }) {
  const { t } = useTranslation(['subjectOptions']);
  if (!status || status === SolutionStatus.NotSolving) return null;

  if (status === SolutionStatus.SolvingScheduled) {
    return (
      <Typography variant="caption" color="text.secondary">
        {t('subjectOptions:scheduledStatus')}
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" color="slate.400">
      <CircularProgress size={18} color="inherit" thickness={4} />
      <Typography variant="caption" color="text.secondary" fontWeight="medium">
        {t('subjectOptions:activeStatus')}
      </Typography>
    </Stack>
  );
}

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
      operation:
        optionsSolutions?.solverStatus === SolutionStatus.NotSolving
          ? OptionsSol_SolverOperation.Start
          : OptionsSol_SolverOperation.Stop,
      optionId,
    });
  };

  return (
    <>
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
        rightAdornment={
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <SolverStatus status={optionsSolutions?.solverStatus} />
            <Button onClick={onOpen} variant="soft" endIcon={<GearIcon />}>
              {t('subjectOptions:solverSettings')}
            </Button>
            <Button variant="contained" color="primary" onClick={toggleSolver}>
              {optionsSolutions?.solverStatus
                ? t(
                    `subjectOptions:solverButtonActions.${optionsSolutions.solverStatus}`
                  )
                : t(`subjectOptions:solverButtonActions.NOT_SOLVING`)}
            </Button>
          </Stack>
        }
      />
      <SolveSettingsModal
        optionsSolutions={optionsSolutions}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
