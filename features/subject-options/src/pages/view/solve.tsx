import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Tooltip,
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
import { CheckmarkIcon, ClockIcon, GearIcon } from '@tyro/icons';
import { StudentTableAvatar } from '@tyro/people';
import {
  getPersonProfileLink,
  OptionsSol_SolverOperation,
  getColorBasedOnIndex,
  SolutionStatus,
} from '@tyro/api';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseOptionsSetup,
  useOptionsSetup,
} from '../../api/options';
import { SolveSettingsModal } from '../../components/view/solve/settings-modal';
import { useOptionsSolutions } from '../../api/options-solutions';
import { useSolveOptions } from '../../api/solve';
import { SolveStats } from '../../components/view/solve/solve-stats';
import { getStudentRows, StudentRow } from '../../utils/get-student-rows';

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
    sort: 'desc',
    sortIndex: 0,
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

function SolverStatus({
  hasSubjectSets,
  status,
}: {
  hasSubjectSets: boolean;
  status: SolutionStatus | undefined;
}) {
  const { t } = useTranslation(['subjectOptions']);
  if (!status || (status === SolutionStatus.NotSolving && !hasSubjectSets))
    return null;

  if (status === SolutionStatus.NotSolving) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CheckmarkIcon sx={{ width: 20, height: 20, color: 'success.main' }} />
        <Typography variant="subtitle2" color="text.secondary">
          {t('subjectOptions:notSolvingStatus')}
        </Typography>
      </Stack>
    );
  }

  if (status === SolutionStatus.SolvingScheduled) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <ClockIcon sx={{ width: 20, height: 20, color: 'slate.400' }} />
        <Typography variant="subtitle2" color="text.secondary">
          {t('subjectOptions:scheduledStatus')}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
      <CircularProgress size={18} color="inherit" thickness={4} />
      <Typography variant="subtitle2" color="text.secondary">
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
  const { mutateAsync: solveOptions, isLoading: isRequestingSolve } =
    useSolveOptions();

  const studentRows = useMemo(
    () => getStudentRows(optionsSetup, optionsSolutions),
    [optionsSetup, optionsSolutions]
  );
  const hasSubjectSets = useMemo(
    () =>
      !!optionsSolutions?.pools.some((pool) =>
        pool.blocks.some((block) =>
          block.subjectGroups.some(
            (subjectSet) => typeof subjectSet.blockIdx === 'number'
          )
        )
      ),
    [optionsSetup]
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

  const disableSolverSettingsButton =
    optionsSolutions?.solverStatus !== SolutionStatus.NotSolving;

  return (
    <>
      <SolveStats
        studentRows={studentRows}
        optionsSolutions={optionsSolutions}
      />
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
            <SolverStatus
              hasSubjectSets={hasSubjectSets}
              status={optionsSolutions?.solverStatus}
            />
            <Tooltip
              title={
                disableSolverSettingsButton
                  ? t(
                      'subjectOptions:cantViewSettingsWhenSolverIsScheduledOrActive'
                    )
                  : undefined
              }
            >
              <span>
                <Button
                  onClick={onOpen}
                  variant="soft"
                  disabled={disableSolverSettingsButton}
                  endIcon={<GearIcon />}
                >
                  {t('subjectOptions:solverSettings')}
                </Button>
              </span>
            </Tooltip>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={isRequestingSolve}
              onClick={toggleSolver}
            >
              {optionsSolutions?.solverStatus
                ? t(
                    `subjectOptions:solverButtonActions.${optionsSolutions.solverStatus}`
                  )
                : t(`subjectOptions:solverButtonActions.NOT_SOLVING`)}
            </LoadingButton>
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
